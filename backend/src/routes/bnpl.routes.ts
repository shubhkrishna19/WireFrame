import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/payment.service';
import { query } from '../config/database';
import { logger } from '../config/logger';

const router = Router();

// BNPL Plans configuration
const bnplPlans = [
  {
    id: 'razorpay-emi-3',
    provider: 'Razorpay',
    name: 'Pay in 3 installments',
    months: 3,
    interestRate: 0,
    description: 'Split your payment into 3 equal installments',
    minAmount: 3000,
    maxAmount: 100000,
    processingFee: 0
  },
  {
    id: 'razorpay-emi-6',
    provider: 'Razorpay',
    name: 'Pay in 6 installments',
    months: 6,
    interestRate: 12,
    description: 'Spread your payment over 6 months',
    minAmount: 5000,
    maxAmount: 200000,
    processingFee: 99
  },
  {
    id: 'razorpay-cardless-emi',
    provider: 'Razorpay',
    name: 'Cardless EMI',
    months: 3,
    interestRate: 0,
    description: 'Buy now, pay later with cardless EMI',
    minAmount: 2000,
    maxAmount: 50000,
    processingFee: 0,
    partners: ['ZestMoney', 'Flexmoney', 'ePayLater']
  },
  {
    id: 'lazypay',
    provider: 'LazyPay',
    name: 'LazyPay - Buy Now Pay Later',
    months: 1,
    interestRate: 0,
    description: 'Pay within 15 days with no interest',
    minAmount: 250,
    maxAmount: 100000,
    processingFee: 0,
    creditLimit: true
  },
  {
    id: 'simpl',
    provider: 'Simpl',
    name: 'Simpl - Pay in 3',
    months: 3,
    interestRate: 0,
    description: 'Split into 3 automatic payments',
    minAmount: 1000,
    maxAmount: 50000,
    processingFee: 0
  }
];

// Get available BNPL plans for an amount
router.get('/plans', async (req: AuthRequest, res: Response) => {
  try {
    const amount = parseFloat(req.query.amount as string) || 0;

    const availablePlans = bnplPlans
      .filter(plan => amount >= plan.minAmount && amount <= plan.maxAmount)
      .map(plan => ({
        ...plan,
        installmentAmount: calculateInstallment(amount, plan.months, plan.interestRate, plan.processingFee)
      }));

    res.json({
      amount,
      currency: 'INR',
      plans: availablePlans,
      count: availablePlans.length
    });
  } catch (error) {
    console.error('Error fetching BNPL plans:', error);
    res.status(500).json({ error: 'Failed to fetch payment plans' });

    return;
  }
});

// Calculate EMI installment
const calculateInstallment = (
  principal: number,
  months: number,
  annualRate: number,
  processingFee: number
): {
  perMonth: number;
  total: number;
  totalInterest: number;
  firstPayment: number;
} => {
  if (annualRate === 0) {
    // No interest
    const perMonth = principal / months;
    const firstPayment = perMonth + processingFee;

    return {
      perMonth: parseFloat(perMonth.toFixed(2)),
      total: parseFloat((principal + processingFee).toFixed(2)),
      totalInterest: 0,
      firstPayment: parseFloat(firstPayment.toFixed(2))
    };
  }

  // Calculate EMI with interest
  const monthlyRate = annualRate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const total = emi * months + processingFee;
  const totalInterest = total - principal - processingFee;

  return {
    perMonth: parseFloat(emi.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    firstPayment: parseFloat((emi + processingFee).toFixed(2))
  };
};

// Check eligibility for BNPL
router.post('/check-eligibility', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, planId, email, phone } = req.body;

    if (!amount || !planId || !email) {
      res.status(400).json({ error: 'Amount, plan ID and email are required' });

      return;
    }

    const plan = bnplPlans.find(p => p.id === planId);

    if (!plan) {
      res.status(404).json({ error: 'Plan not found' });

      return;
    }

    // Check amount eligibility
    if (amount < plan.minAmount || amount > plan.maxAmount) {
      res.json({
        eligible: false,
        reason: `Amount must be between ₹${plan.minAmount} and ₹${plan.maxAmount}`,
        alternativePlans: bnplPlans.filter(p =>
          amount >= p.minAmount && amount <= p.maxAmount
        ).map(p => p.id)
      });
      return;
    }

    // Check user eligibility (in real implementation, this would call provider's eligibility API)
    // For this example, we'll create a mock check based on database records
    try {
      // Check if user has history or meets basic criteria
      const userResult = await query(
        'SELECT * FROM users WHERE email = $1 LIMIT 1',
        [email]
      );

      let baseEligibility = true;
      let eligibilityReason = '';

      // If user exists and has completed orders, better eligibility
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];

        // Check user's order history for eligibility
        const orderHistoryResult = await query(`
          SELECT COUNT(*) as count, SUM(total_amount) as total_spent
          FROM orders
          WHERE user_id = $1 AND payment_status = 'completed'
        `, [user.id]);

        const orderHistory = orderHistoryResult.rows[0];
        const completedOrders = parseInt(orderHistory.count);

        // Users with 2+ completed orders get better eligibility
        if (completedOrders < 2) {
          baseEligibility = Math.random() > 0.4; // 60% approval for new users
          eligibilityReason = 'New user - requires more purchase history';
        } else {
          baseEligibility = Math.random() > 0.2; // 80% approval for returning users
          eligibilityReason = 'Returning customer with purchase history';
        }
      } else {
        // New users have lower eligibility
        baseEligibility = Math.random() > 0.5; // 50% approval for new users
        eligibilityReason = 'New user - requires account creation';
      }

      if (!baseEligibility) {
        res.json({
          eligible: false,
          reason: eligibilityReason || 'Not eligible at this time. Please try another payment method.',
          alternativePlans: bnplPlans.filter(p =>
            amount >= p.minAmount && amount <= p.maxAmount
          ).map(p => p.id)
        });
        return;
      }

      // If eligible, calculate installment details
      const installmentDetails = calculateInstallment(
        amount,
        plan.months,
        plan.interestRate,
        plan.processingFee
      );

      res.json({
        eligible: true,
        plan: {
          ...plan,
          ...installmentDetails
        },
        schedule: generatePaymentSchedule(amount, plan.months, installmentDetails.perMonth, plan.processingFee)
      });
    } catch (dbError) {
      // If database check fails, use basic eligibility
      console.error('Database eligibility check failed:', dbError);

      // Fallback to basic eligibility check
      const installmentDetails = calculateInstallment(
        amount,
        plan.months,
        plan.interestRate,
        plan.processingFee
      );

      res.json({
        eligible: true,
        plan: {
          ...plan,
          ...installmentDetails
        },
        schedule: generatePaymentSchedule(amount, plan.months, installmentDetails.perMonth, plan.processingFee)
      });
    }
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });

    return;
  }
});

// Generate payment schedule
const generatePaymentSchedule = (
  amount: number,
  months: number,
  installment: number,
  processingFee: number
) => {
  const schedule = [];
  const today = new Date();

  for (let i = 0; i < months; i++) {
    const dueDate = new Date(today);
    dueDate.setMonth(dueDate.getMonth() + i + 1);

    const isFirstPayment = i === 0;
    const paymentAmount = isFirstPayment ? installment + processingFee : installment;

    schedule.push({
      installmentNumber: i + 1,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: parseFloat(paymentAmount.toFixed(2)),
      status: 'pending',
      description: isFirstPayment ? 'First installment + processing fee' : `Installment ${i + 1}`
    });
  }

  return schedule;
};

// Create BNPL order
router.post('/create-order', async (req: AuthRequest, res: Response) => {
  try {
    const { amount, planId, email, phone, orderId } = req.body;

    if (!amount || !planId || !email || !orderId) {
      res.status(400).json({
        error: 'Amount, plan ID, email, and order ID are required'
      });

      return;
    }

    const plan = bnplPlans.find(p => p.id === planId);

    if (!plan) {
      res.status(404).json({ error: 'Plan not found' });

      return;
    }

    // Check if order exists and is valid
    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rows.length === 0) {
      res.status(404).json({ error: 'Order not found' });

      return;
    }

    const order = orderResult.rows[0];
    if (order.status !== 'pending' || order.payment_status !== 'pending') {
      res.status(400).json({ error: 'Order is not in pending status' });

      return;
    }

    // Create Razorpay order for BNPL
    const razorpayOrder = await createRazorpayOrder(amount, 'INR', orderId);

    // Calculate installment details with actual BNPL implementation
    const installmentDetails = calculateInstallment(
      amount,
      plan.months,
      plan.interestRate,
      plan.processingFee
    );

    // Create BNPL order record in database
    const bnplOrderResult = await query(`
      INSERT INTO bnpl_orders (
        id, order_id, amount, plan_id, plan_details, payment_schedule, customer_email, customer_phone,
        status, razorpay_order_id, installment_details, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `, [
      `bnpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      amount,
      planId,
      JSON.stringify(plan),
      JSON.stringify(generatePaymentSchedule(amount, plan.months, installmentDetails.perMonth, plan.processingFee)),
      email,
      phone || null,
      'created',
      razorpayOrder.orderId,
      JSON.stringify(installmentDetails)
    ]);

    const bnplOrder = bnplOrderResult.rows[0];

    // Update order to indicate BNPL is selected
    await query(`
      UPDATE orders SET
        payment_method = 'bnpl',
        bnpl_order_id = $1,
        updated_at = NOW()
      WHERE id = $2
    `, [bnplOrder.id, orderId]);

    res.json({
      success: true,
      order: {
        id: bnplOrder.id,
        orderId,
        amount,
        currency: 'INR',
        plan: {
          ...plan,
          ...installmentDetails
        },
        schedule: generatePaymentSchedule(amount, plan.months, installmentDetails.perMonth, plan.processingFee),
        customer: {
          email,
          phone
        },
        status: 'created',
        razorpayOrderId: razorpayOrder.orderId,
        paymentUrl: `https://checkout.razorpay.com/v1/checkout?key=${process.env.RAZORPAY_KEY_ID}&order_id=${razorpayOrder.orderId}`,
        createdAt: bnplOrder.created_at
      },
      message: 'BNPL order created successfully'
    });
  } catch (error) {
    console.error('Error creating BNPL order:', error);
    res.status(500).json({ error: 'Failed to create BNPL order' });

    return;
  }
});

// Verify BNPL payment
router.post('/verify-payment', async (req: AuthRequest, res: Response) => {
  try {
    const { bnplOrderId, razorpayOrderId, paymentId, signature } = req.body;

    if (!bnplOrderId || !razorpayOrderId || !paymentId || !signature) {
      res.status(400).json({
        error: 'BNPL order ID, Razorpay order ID, payment ID, and signature required'
      });

      return;
    }

    // Fetch BNPL order from database
    const bnplOrderResult = await query(
      'SELECT * FROM bnpl_orders WHERE id = $1',
      [bnplOrderId]
    );

    if (bnplOrderResult.rows.length === 0) {
      res.status(404).json({ error: 'BNPL order not found' });

      return;
    }

    const bnplOrder = bnplOrderResult.rows[0];

    if (bnplOrder.razorpay_order_id !== razorpayOrderId) {
      res.status(400).json({ error: 'Razorpay order ID mismatch' });

      return;
    }

    // Verify payment with Razorpay
    const isVerified = await verifyRazorpayPayment(razorpayOrderId, paymentId, signature);

    if (!isVerified) {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });

      return;
    }

    // Update BNPL order status
    await query(`
      UPDATE bnpl_orders
      SET status = 'active', payment_id = $1, verified_at = NOW(), updated_at = NOW()
      WHERE id = $2
    `, [paymentId, bnplOrderId]);

    // Update the main order status
    await query(`
      UPDATE orders
      SET payment_status = 'completed', status = 'confirmed', updated_at = NOW()
      WHERE id = $1
    `, [bnplOrder.order_id]);

    // Update payment transaction
    await query(`
      UPDATE payment_transactions
      SET status = 'completed', updated_at = NOW()
      WHERE transaction_id = $1
    `, [razorpayOrderId]);

    logger.info(`BNPL payment verified for order ${bnplOrder.order_id}`);

    res.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully',
      bnplOrderId,
      paymentId,
      status: 'active',
      orderId: bnplOrder.order_id
    });
  } catch (error) {
    console.error('Error verifying BNPL payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });

    return;
  }
});

// Get BNPL order details
router.get('/order/:orderId', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    // Fetch BNPL order from database
    const bnplOrderResult = await query(`
      SELECT * FROM bnpl_orders WHERE id = $1 OR order_id = $1
    `, [orderId]);

    if (bnplOrderResult.rows.length === 0) {
      res.status(404).json({ error: 'BNPL order not found' });

      return;
    }

    const bnplOrder = bnplOrderResult.rows[0];

    // Parse stored data
    const planDetails = JSON.parse(bnplOrder.plan_details);
    const paymentSchedule = JSON.parse(bnplOrder.payment_schedule);

    // Calculate installments paid and remaining
    const installmentsPaid = paymentSchedule.filter((payment: any) => payment.status === 'paid').length;
    const installmentsRemaining = paymentSchedule.filter((payment: any) => payment.status === 'pending').length;

    // Find next payment
    const nextPayment = paymentSchedule
      .filter((payment: any) => payment.status === 'pending')
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    res.json({
      id: bnplOrder.id,
      orderId: bnplOrder.order_id,
      status: bnplOrder.status,
      amount: bnplOrder.amount,
      provider: planDetails.provider,
      plan: planDetails,
      installmentsPaid,
      installmentsRemaining,
      nextPaymentDate: nextPayment ? nextPayment.dueDate : null,
      nextPaymentAmount: nextPayment ? nextPayment.amount : null,
      totalInstallments: paymentSchedule.length,
      paymentSchedule,
      createdAt: bnplOrder.created_at,
      updatedAt: bnplOrder.updated_at
    });
  } catch (error) {
    console.error('Error fetching BNPL order:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });

    return;
  }
});

// Get supported providers
router.get('/providers', async (req: AuthRequest, res: Response) => {
  try {
    const providers = [
      {
        id: 'razorpay',
        name: 'Razorpay',
        logo: '/images/razorpay-logo.png',
        description: 'India\'s leading payment gateway',
        features: ['EMI', 'Cardless EMI', 'No Cost EMI'],
        minAmount: 2000,
        processingTime: 'Instant'
      },
      {
        id: 'lazypay',
        name: 'LazyPay',
        logo: '/images/lazypay-logo.png',
        description: 'Buy now, pay in 15 days',
        features: ['Zero interest', 'Instant approval', 'Credit limit'],
        minAmount: 250,
        processingTime: 'Instant'
      },
      {
        id: 'simpl',
        name: 'Simpl',
        logo: '/images/simpl-logo.png',
        description: 'Pay in 3 installments',
        features: ['Zero interest', 'Auto-debit', 'No hidden charges'],
        minAmount: 1000,
        processingTime: 'Instant'
      }
    ];

    res.json({
      providers,
      count: providers.length
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });

    return;
  }
});

export default router;


@echo off
cls
color 0A
echo.
echo  ╔═══════════════════════════════════════════════════════╗
echo  ║                                                       ║
echo  ║    PREMIUM FEATURES INSTALLATION                     ║
echo  ║    10 World-Class Features for Your Ecommerce Store  ║
echo  ║                                                       ║
echo  ╚═══════════════════════════════════════════════════════╝
echo.
echo.

echo [STEP 1] Installing Required Dependencies...
echo =====================================================
echo.
echo Installing: framer-motion recharts socket.io-client axios lucide-react
echo.
call npm install framer-motion recharts socket.io-client axios lucide-react --legacy-peer-deps
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)
echo.
echo ✅ Dependencies installed successfully!
echo.

echo.
echo [STEP 2] Features Created
echo =====================================================
echo.
echo ✅ 1. Social Proof Notifications
echo    └─ src/components/SocialProofNotifications.tsx
echo.
echo ✅ 2. AI Product Recommendations  
echo    └─ src/components/AIProductRecommendations.tsx
echo.
echo ✅ 3. Spin-the-Wheel Game
echo    └─ src/components/SpinTheWheel.tsx
echo.
echo ✅ 4. User Content Gallery
echo    └─ src/components/UserContentGallery.tsx
echo.
echo ✅ 5. Style Quiz
echo    └─ src/components/StyleQuiz.tsx
echo.
echo ✅ 6. Abandoned Cart Recovery
echo    └─ Already exists in your project
echo.
echo ✅ 7. BNPL Integration
echo    └─ Ready for Razorpay/LazyPay integration
echo.
echo ✅ 8. Membership Tiers
echo    └─ src/components/MembershipTiers.tsx
echo.
echo ✅ 9. Live Chat with AI
echo    └─ src/components/LiveChatAI.tsx
echo.
echo ✅ 10. Advanced Analytics Dashboard
echo     └─ src/components/AdvancedAnalytics.tsx
echo.

echo.
echo [STEP 3] Integration Instructions
echo =====================================================
echo.
echo Open your src/App.tsx and add these imports:
echo.
echo   import SocialProofNotifications from './components/SocialProofNotifications';
echo   import SpinTheWheel from './components/SpinTheWheel';
echo   import LiveChatAI from './components/LiveChatAI';
echo   import StyleQuiz from './components/StyleQuiz';
echo.
echo Then add them in your JSX (after your routes):
echo.
echo   ^<SocialProofNotifications /^>
echo   ^<SpinTheWheel /^>
echo   ^<LiveChatAI /^>
echo   ^<StyleQuiz /^>
echo.

echo.
echo [STEP 4] Start Development Server
echo =====================================================
echo.
echo Your server is running on: http://localhost:5173
echo.
echo To test the new features:
echo   1. Open http://localhost:5173 in your browser
echo   2. Look for the chat icon (bottom right)
echo   3. Look for style quiz icon (right side)
echo   4. Spin wheel will appear after 5 seconds
echo   5. Social proof notifications at bottom left
echo.

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║              🎉 INSTALLATION COMPLETE! 🎉             ║
echo ║                                                       ║
echo ║  You now have 10 premium features that will make     ║
echo ║  your ecommerce store stand out from competitors!    ║
echo ║                                                       ║
echo ║  📖 Read PREMIUM_FEATURES_IMPLEMENTATION.md          ║
echo ║     for detailed integration guide                   ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo.
echo Press any key to view the implementation guide...
pause >nul
type PREMIUM_FEATURES_IMPLEMENTATION.md | more

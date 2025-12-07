#!/bin/bash

# Monitor EAS build status
BUILD_ID="ae69c1c5-fbbf-429f-a609-b13c912b6cea"

echo "🔍 Monitoring EAS Build..."
echo "Build ID: $BUILD_ID"
echo ""
echo "⏳ Checking status every 30 seconds..."
echo "Press Ctrl+C to stop monitoring"
echo ""

while true; do
    # Get build status
    STATUS=$(cd /home/nicorapelas/Workspace/cv-cloud/rebuild/mobile && eas build:list --limit 1 2>/dev/null | grep "Status" | awk '{print $2}')
    
    TIMESTAMP=$(date "+%H:%M:%S")
    
    if [ "$STATUS" == "finished" ]; then
        echo ""
        echo "═══════════════════════════════════════"
        echo "✅ BUILD COMPLETED SUCCESSFULLY! 🎉"
        echo "═══════════════════════════════════════"
        echo "Time: $TIMESTAMP"
        echo ""
        echo "Next steps:"
        echo "1. Download the AAB file"
        echo "2. Submit to Internal Testing:"
        echo "   eas submit --platform android --track internal"
        echo ""
        echo "Build URL:"
        echo "https://expo.dev/accounts/nicorapelas/projects/cv-cloud-mobile-rebuild/builds/$BUILD_ID"
        echo ""
        break
    elif [ "$STATUS" == "errored" ]; then
        echo ""
        echo "═══════════════════════════════════════"
        echo "❌ BUILD FAILED"
        echo "═══════════════════════════════════════"
        echo "Time: $TIMESTAMP"
        echo ""
        echo "Check logs at:"
        echo "https://expo.dev/accounts/nicorapelas/projects/cv-cloud-mobile-rebuild/builds/$BUILD_ID"
        echo ""
        break
    elif [ "$STATUS" == "canceled" ]; then
        echo ""
        echo "⚠️ Build was canceled"
        break
    else
        echo "[$TIMESTAMP] Status: $STATUS ⏳"
        sleep 30
    fi
done







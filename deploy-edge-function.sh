#!/bin/bash

# Supabase Edge Function Deployment Script
# This script helps you deploy the updated Edge Function code

echo "=========================================="
echo "Luna Edge Function Deployment Guide"
echo "=========================================="
echo ""
echo "📋 DEPLOYMENT INSTRUCTIONS:"
echo ""
echo "1. Open your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/cfncybumrvnmdbvyogkr"
echo ""
echo "2. Navigate to: Edge Functions → make-server-7f9db486"
echo ""
echo "3. Update the following files:"
echo ""
echo "   📄 index.tsx"
echo "   Location: src/supabase/functions/server/index.tsx"
echo ""
echo "   📄 ai_service.tsx"
echo "   Location: src/supabase/functions/server/ai_service.tsx"
echo ""
echo "4. After updating both files, click 'Deploy'"
echo ""
echo "=========================================="
echo ""
echo "✅ Verifying files exist..."
echo ""

FILES=(
  "src/supabase/functions/server/index.tsx"
  "src/supabase/functions/server/ai_service.tsx"
)

cd /Users/a00156501/Downloads/LUNA-main

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
    echo "  Last modified: $(stat -f '%Sm' -t '%Y-%m-%d %H:%M:%S' "$file")"
    echo "  Size: $(stat -f '%z' "$file") bytes"
  else
    echo "✗ $file - NOT FOUND"
  fi
  echo ""
done

echo "=========================================="
echo ""
echo "📝 WHAT'S NEW IN THIS UPDATE:"
echo ""
echo "• Added simulationSettings parameter to API"
echo "• Added personality-based AI behavior (5 types)"
echo "• Added intensity levels (low/medium/high)"
echo "• Updated initial message generation"
echo ""
echo "Personality Types:"
echo "  • aggressive      - Direct and pushy"
echo "  • passive_aggressive - Guilt-tripping"
echo "  • gaslighting     - Reality-denying"
echo "  • flirty          - Inappropriate/boundary-crossing"
echo "  • subtle          - Manipulative but hidden"
echo ""
echo "=========================================="

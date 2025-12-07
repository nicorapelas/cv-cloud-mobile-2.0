#!/bin/bash
# Fix AVD on Pop!_OS - Run with: bash fix-avd.sh

echo "🔧 Fixing AVD on Pop!_OS..."
echo ""

# Step 1: Add user to kvm group
echo "Step 1: Adding user to kvm group..."
sudo usermod -aG kvm $USER

# Step 2: Verify KVM device permissions
echo ""
echo "Step 2: Checking KVM device..."
ls -la /dev/kvm

# Step 3: Check if user needs to log out
echo ""
echo "✅ User added to kvm group!"
echo ""
echo "⚠️  IMPORTANT: You need to log out and log back in (or restart) for this to take effect."
echo ""
echo "After logging back in, verify with: groups | grep kvm"
echo ""
echo "Then try starting your AVD again."





# Define target (to see the full list, run `xcrun simctl list devices`)
TARGET='iPad (9th generation)'

# Get the simulator PID
SIM_ID=$(xcrun simctl list devices | grep -m 1 "${TARGET}" | grep -E -o -i '([0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12})')

echo "Using PID: ${SIM_ID}"

# Build the app
ionic cap run ios --configuration development --target="${SIM_ID}"

echo "Shutting down sim(s)"

killall Simulator

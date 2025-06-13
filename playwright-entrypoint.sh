#!/bin/bash

# Print the suite and browser being used
echo "Running Playwright tests for suite: $SUITE on browser: $BROWSER"

# Determine the appropriate Playwright command
if [ "$COVERAGE" = "true" ]; then
    playwrightCommand="npm run coverage"
elif [ "$SUITE" = "all-tests" ]; then
    playwrightCommand="npm run test:all"
else
    playwrightCommand="npm run test"
fi

# Execute the Playwright command
echo "Executing: $playwrightCommand"
$playwrightCommand

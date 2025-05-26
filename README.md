# Automated Testing Plan with Serenity - Screenplay

This repository contains the implementation of an automated testing plan developed using Playwright POM. The project was created as part of the automation course offered by Academia QA and adapted for use with the Your Store demo application.

## Project Overview

The main objective of this project is to demonstrate a robust and maintainable test automation framework using Playwright, and the POM design pattern.

The repository includes:
- Test cases automated with Playwright.
- POM structure for reusable and maintainable components.


## File Structure
```
📦 YourStore-Playwright-TestLab


```

## Prerequisites

Ensure you have the following installed:
- Node v22.14.0
- npm 10.9.2
- Chrome, Edge and Firefox browser
- VS Code (recommended for development)

## Getting Started

Clone this repository:
```bash
git clone git@github.com:juanMBMedina/YourStore-Playwright-TestLab.git
cd YourStore-Playwright-TestLab
```

To run tests with a specific browser (e.g., Edge) and remote mode, remote mode have the parameter headless by default:
```bash
run suites
```

Or set the environment variable before running:
```bash
run suites
```
Run sonar-scanner in Local Environment:
```bash
sonar-scanner.bat -D"sonar.login=%SONAR_TOKEN%" -D"project.settings=sonar-scanner.properties" -D"sonar.projectBaseDir=."
```

## Running in VS Code

To run with custom VM options in IntelliJ:
1. In develop
2. Go to `Run > Edit Configurations`.

## Reports

After execution, Playwright generates detailed HTML reports. Find them in:
```
/reports/
```

## Contributing

Feel free to fork the project, open issues, or submit pull requests to enhance the framework.

## License

This project is licensed under the GNU General Public License v3.0.

## Contact

For questions or feedback, please contact:

- **Name:** Juan Miguel Blanco Medina
- **Email:** juanmblancom@gmail.com
- **GitHub:** [https://github.com/juanMBMedina](https://github.com/juanMBMedina)

import { UserLogin } from "../models/UserLogin";
import { AccountPage } from "../pages/Account";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";

export async function goToLogin(homePage: HomePage, loginPage: LoginPage) {
  logStep("1. Go to the main page");
  homePage.goto();
  homePage.expectHomeUrl();

  logStep("2. Go to login section");
  homePage.gotoLoginPage();
  loginPage.expectLoginUrl();
}

export async function goToRegister(homePage: HomePage, registerPage: RegisterPage) {
  logStep("1. Go to the main page");
  homePage.goto();
  homePage.expectHomeUrl();

  logStep("2. Go to register section");
  homePage.gotoRegisterPage();
  registerPage.expectRegisterUrl();
}

export function logStep(step: string) {
  console.log(`\x1b[36m[STEP]\x1b[0m ${step}`);
}

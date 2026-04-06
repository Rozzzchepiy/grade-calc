import { test, expect } from '@playwright/test';

test.describe('GradeCalc E2E Tests', () => {
  test('Користувач може додати предмет і побачити розрахунок стипендії', async ({ page }) => {
    // Відкриваємо локальний сервер
    await page.goto('http://localhost:5173');

    // Перевіряємо, чи завантажилась сторінка
    await expect(page.locator('h1')).toContainText('GradeCalc');

    // Заповнюємо форму
    await page.fill('input[placeholder="Назва предмета"]', 'Програмування');
    await page.fill('input[placeholder="Оцінка (макс 100)"]', '100');
    await page.fill('input[placeholder="Кредити"]', '5');

    // Додаємо додаткові бали
    // Використовуємо locator, щоб знайти інпут поруч із текстом
    await page.locator('.extra-input').fill('10');

    // Натискаємо кнопку додати
    await page.click('button.add-btn');

    // Перевіряємо, чи з'явився предмет у списку
    await expect(page.locator('.subject-list')).toContainText('Програмування');

    // Перевіряємо розрахунок стипендії: (100 * 0.95) + (10 * 0.05) = 95 + 0.5 = 95.50
    await expect(page.locator('.result-card.highlight h2')).toHaveText('95.50');
  });
});
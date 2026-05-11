import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
// eslint-disable-next-line no-unused-vars
import App from './App';

describe('GradeCalc Unit Tests', () => {
  // Очищуємо LocalStorage перед кожним тестом, щоб вони були ізольованими
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Коректно рендерить заголовок додатку', () => {
    render(<App />);
    expect(screen.getByText(/GradeCalc/i)).toBeInTheDocument();
  });

  it('2. Не додає предмет, якщо поля порожні', () => {
    render(<App />);
    const addButton = screen.getByText('Додати');
    
    // Перехоплюємо alert, щоб тест не впав
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(addButton);
    
    expect(alertMock).toHaveBeenCalledWith('Будь ласка, заповніть всі поля коректно.');
    alertMock.mockRestore();
  });

  it('3. Успішно додає новий предмет у список', () => {
    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText('Назва предмета'), { target: { value: 'Математика' } });
    fireEvent.change(screen.getByPlaceholderText('Оцінка (макс 100)'), { target: { value: '95' } });
    fireEvent.change(screen.getByPlaceholderText('Кредити'), { target: { value: '5' } });
    
    fireEvent.click(screen.getByText('Додати'));

    expect(screen.getByText('Математика')).toBeInTheDocument();
    expect(screen.getByText(/Оцінка: 95/i)).toBeInTheDocument();
  });

  it('4. Правильно рахує рейтинговий бал', () => {
    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText('Назва предмета'), { target: { value: 'Фізика' } });
    fireEvent.change(screen.getByPlaceholderText('Оцінка (макс 100)'), { target: { value: '90' } });
    fireEvent.change(screen.getByPlaceholderText('Кредити'), { target: { value: '4' } });
    fireEvent.click(screen.getByText('Додати'));

    // Рейтинговий бал має бути 90.00
    expect(screen.getByText('90.00')).toBeInTheDocument();
  });

  it('5. Видаляє предмет зі списку', () => {
    render(<App />);
    
    // Спочатку додаємо
    fireEvent.change(screen.getByPlaceholderText('Назва предмета'), { target: { value: 'Історія' } });
    fireEvent.change(screen.getByPlaceholderText('Оцінка (макс 100)'), { target: { value: '80' } });
    fireEvent.change(screen.getByPlaceholderText('Кредити'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Додати'));

    // Потім видаляємо
    const deleteButton = screen.getByText('Видалити');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Історія')).not.toBeInTheDocument();
  });
});
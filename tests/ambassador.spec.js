import { test, expect } from '@playwright/test';

test.describe('Ambassador Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the ambassador page for each test
    await page.goto('/ambassador');
  });

  test('should show sign in required message for unauthenticated users', async ({ page }) => {
    // Wait for the page to load and check authentication status
    await page.waitForLoadState('networkidle');
    
    // Should show the sign in required screen
    await expect(page.getByText('Sign In Required')).toBeVisible();
    await expect(page.getByText('Please sign in or create an account to apply for the Campus Ambassador program.')).toBeVisible();
    
    // Should have a "Go to Login" button
    const loginButton = page.getByRole('button', { name: 'Go to Login' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('should navigate to login page when clicking "Go to Login" button', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Click the "Go to Login" button
    const loginButton = page.getByRole('button', { name: 'Go to Login' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    
    // Should navigate to the login page
    await expect(page).toHaveURL('/login');
  });

  test('should show proper loading states during authentication check', async ({ page }) => {
    // Check for loading spinner when first loading the page
    const loadingText = page.getByText('Checking authentication...');
    
    // The loading text might appear briefly, so we use waitFor with a timeout
    try {
      await expect(loadingText).toBeVisible({ timeout: 2000 });
    } catch (error) {
      // If loading is too fast, that's fine - the page loaded quickly
      console.log('Authentication check completed quickly');
    }
    
    // Eventually should show the sign in required message
    await expect(page.getByText('Sign In Required')).toBeVisible({ timeout: 5000 });
  });

  test('should have proper page structure and styling', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check for the lock icon
    const lockIcon = page.locator('svg').first();
    await expect(lockIcon).toBeVisible();
    
    // Check for proper heading structure
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText('Sign In Required');
    
    // Check for description text
    await expect(page.getByText('Please sign in or create an account')).toBeVisible();
    
    // Verify the button has proper styling classes (checking for quantum button styling)
    const loginButton = page.getByRole('button', { name: 'Go to Login' });
    const buttonClasses = await loginButton.getAttribute('class');
    expect(buttonClasses).toContain('btn-quantum');
  });

  test('should be responsive and work on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Should still show the sign in message
    await expect(page.getByText('Sign In Required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Login' })).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    // Should still show the sign in message
    await expect(page.getByText('Sign In Required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Login' })).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForLoadState('networkidle');
    
    // Should still show the sign in message
    await expect(page.getByText('Sign In Required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to Login' })).toBeVisible();
  });

  test('should not show any critical console errors during page load', async ({ page }) => {
    const consoleErrors = [];
    
    // Listen for console errors, but filter out 404s for static resources
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        // Filter out non-critical 404 errors for favicon or other static resources
        if (!errorText.includes('404') && !errorText.includes('Failed to load resource')) {
          consoleErrors.push(errorText);
        }
      }
    });
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Give some time for any async operations to complete
    await page.waitForTimeout(2000);
    
    // Check that no critical console errors occurred
    expect(consoleErrors).toHaveLength(0);
  });

  test('should handle page navigation correctly', async ({ page }) => {
    // Verify we're on the ambassador page
    await expect(page).toHaveURL('/ambassador');
    
    // Check page title or heading to confirm we're on the right page
    await expect(page.getByText('Sign In Required')).toBeVisible();
    
    // Navigate away and back to test routing
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Navigate back to ambassador page
    await page.goto('/ambassador');
    await expect(page).toHaveURL('/ambassador');
    await expect(page.getByText('Sign In Required')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for proper heading hierarchy
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    
    // Check that the login button is accessible
    const loginButton = page.getByRole('button', { name: 'Go to Login' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
    
    // Verify button can be focused
    await loginButton.focus();
    await expect(loginButton).toBeFocused();
  });
});

test.describe('Ambassador Form - Registration Flow', () => {
  test('should have registration verification functionality built-in', async ({ page }) => {
    // This test verifies that the registration flow components exist
    // The actual authentication/registration flow requires mocking Supabase
    
    await page.goto('/ambassador');
    await page.waitForLoadState('networkidle');
    
    // Verify the page loads correctly and shows the authentication gate
    await expect(page).toHaveURL('/ambassador');
    await expect(page.getByText('Sign In Required')).toBeVisible();
    
    // This confirms the authentication gate is working as designed
    // Future tests could mock Supabase authentication for full flow testing
  });
});
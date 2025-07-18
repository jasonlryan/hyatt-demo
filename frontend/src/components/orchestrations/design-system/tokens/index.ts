export const orchestrationTokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  colors: {
    primary: {
      50: '#f0fdf4',
      600: '#16a34a',
      700: '#15803d',
    },
    neutral: {
      50: '#fafafa',
      800: '#262626',
      900: '#171717',
    },
  },
  typography: {
    heading1: 'text-3xl font-bold',
    heading2: 'text-2xl font-semibold',
    body: 'text-base',
    caption: 'text-sm text-gray-600',
  },
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  },
  borders: {
    radius: {
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
    },
  },
};

export type OrchestrationTokens = typeof orchestrationTokens;

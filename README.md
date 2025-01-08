# Reservation Hub

Reservation Hub is a React Native application built with Expo, designed for managing reservations across various sectors like grooming, accommodation, rental, and food. The app offers features such as location-based branch discovery, reservation management, and sector-specific functionalities.

## Overview

Reservation Hub aims to provide a seamless reservation experience for users, while also offering a robust management system for businesses. The app is built using a modular architecture, making it easy to maintain and extend.

## Features

- **User Authentication**: Login and signup functionality powered by Supabase.
- **Branch Discovery**: Find nearby branches based on your current location using PostgreSQL's PostGIS by Supabase.
- **Assets**: Dynamic assets for sector of the branch.
- **Custom Services**: Additional services for assets.
- **Reservations**: Make, view, and manage reservations with branch-specific details.
- **Dynamic Tabs**: Tab-based navigation tailored for different user roles and contexts.
- **Custom Components**: A variety of reusable UI components like buttons, cards, inputs, and modals.
- **Location Integration**: Leveraging `expo-location` and Google Maps for geolocation and branch mapping.

## Project Structure

```plain
ilyasbilgihan/reservation-app/
├── app/                      # Core application pages and navigation
│   ├── (tabs)/               # Tab-based navigation components
│   ├── (other)/              # Additional screens like branch details and reservations
│   └── _layout.tsx           # Global layout configuration
├── assets/                   # Static assets like images and fonts
├── components/               # Reusable components and UI elements
│   ├── ui/                   # UI primitives like buttons, cards, and inputs
│   ├── ReservationSteps/     # Components for reservation process steps
│   └── BottomSheetComponents # Components for bottom sheet dialogs
├── context/                  # Global context for state management
├── lib/                      # Utilities, hooks, and constants
└── global.css                # Tailwind CSS configurations
└── supabase_schema.sql       # An example of db schema
```

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ilyasbilgihan/reservation-app.git
   cd reservation-app
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Configure environment variables in `eas.json`, `.env` and `app.json`

4. Start the development server:
   ```bash
   bun run start --clear
   ```

### Building

Install, login and configure an EAS project. Then, build it following this [guide](https://docs.expo.dev/build/setup/).

## Dependencies

### Key Dependencies

- [React Native](https://reactnative.dev/): Core framework.
- [Expo](https://expo.dev/): Framework and platform for React Native apps.
- [Supabase](https://supabase.io/): Backend for authentication and data management.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework.
- [NativeWind](https://www.nativewind.dev/): Tailwind CSS for React Native.
- [React Navigation](https://reactnavigation.org/): Navigation solution for React Native.
- [React Native Maps](https://github.com/react-native-maps/react-native-maps): Map integration.
- [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/): Modal bottom sheets.
- [React Native Reusables](https://rnr-docs.vercel.app/getting-started/introduction/): Universal shadcn/ui for React Native featuring a focused collection of components.

### Dev Dependencies

- [ESLint](https://eslint.org/): JavaScript and TypeScript linting.
- [Prettier](https://prettier.io/): Code formatting.
- [Tailwind CSS Plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss): Tailwind-specific formatting.

### Customization

- Update `tailwind.config.js` to modify theme settings.
- Edit `app.json` to change app metadata like name, icons, and splash screens.

## License

This project is licensed under the MIT License.

import { View } from 'react-native';
import TabBarButton from './TabBarButton';

const TabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View
      style={{ borderWidth: 1, height: 70 }}
      className="absolute bottom-0 w-full flex-row rounded-3xl border-violet-50 bg-background">
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (options.tabBarButton) return null;
        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? options.tabBarActiveTintColor : options.tabBarInactiveTintColor}
            label={label}
          />
        );
      })}
    </View>
  );
};

export default TabBar;

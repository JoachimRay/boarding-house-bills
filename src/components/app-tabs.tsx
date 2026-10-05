import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function BottomTab() {
  return (
    <NativeTabs backgroundColor="#0b0f14" tintColor="#62e6ff" >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="customers">
        <NativeTabs.Trigger.Label>Customer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/explore.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
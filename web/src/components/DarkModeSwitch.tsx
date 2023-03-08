import { useColorMode, IconButton, Icon } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <IconButton
      aria-label="Toggle Theme"
      icon={<Icon as={isDark ? SunIcon : MoonIcon} />}
      onClick={toggleColorMode}
      position="fixed"
      size="md"
      fontSize="2xl"
      top="4"
      right="4"
      colorScheme={isDark ? "yellow" : "gray"}
      variant="ghost"
    />
  )
}

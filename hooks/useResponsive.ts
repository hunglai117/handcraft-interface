import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export function useResponsive() {
  const [mounted, setMounted] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 768 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isDesktop: mounted && isDesktop,
    isMobile: mounted && isMobile,
    mounted,
  };
}

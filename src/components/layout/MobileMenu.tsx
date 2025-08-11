"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  onLogout: () => void;
  isLoggingOut: boolean;
}

export default function MobileMenu({
  isOpen,
  onClose,
  navigationItems,
  onLogout,
  isLoggingOut,
}: MobileMenuProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { currentTheme } = useTheme();

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gradient-to-r from-black/40 to-black/20 z-[9998] lg:hidden backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />

      {/* Menu container */}
      <div
        className="fixed inset-y-0 right-0 w-80 max-w-[85vw] shadow-2xl z-[9999] lg:hidden flex flex-col"
        style={{
          height: "100vh",
          backgroundColor: currentTheme.colors?.cardBg || "#ffffff",
          boxShadow: `0 25px 50px ${
            currentTheme.colors?.primaryAccentDark || "#000000"
          }25, 0 15px 35px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        }}
      >
        {/* Header (fixed inside menu) */}
        <div
          className="flex items-center justify-between p-6 border-b backdrop-blur-sm shrink-0"
          style={{
            borderColor: `${currentTheme.colors.borderSecondary}25`,
            background: `linear-gradient(135deg, ${currentTheme.colors.cardBg}90 0%, ${currentTheme.colors.cardBg}70 100%)`,
          }}
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: `${currentTheme.colors.primaryAccent}20`,
                boxShadow: `0 4px 12px ${currentTheme.colors.primaryAccent}25`,
              }}
            >
              <div
                className="w-6 h-6 rounded-lg"
                style={{ backgroundColor: currentTheme.colors.primaryAccent }}
              />
            </div>
            <h2
              className="text-2xl font-bold whitespace-nowrap"
              style={{ color: currentTheme.colors.textPrimary }}
            >
              القائمة الرئيسية
            </h2>
          </div>
          <button
            onClick={onClose}
            className="group p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-lg"
            style={{
              backgroundColor: `${currentTheme.colors.primaryAccent}15`,
              color: currentTheme.colors.primaryAccent,
              border: `1px solid ${currentTheme.colors.primaryAccent}25`,
            }}
          >
            <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="space-y-3">
            {navigationItems && navigationItems.length > 0 ? (
              navigationItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.dropdownItems &&
                    item.dropdownItems.some(
                      (dropdownItem) => pathname === dropdownItem.href
                    ));

                return (
                  <div key={item.name || index}>
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.name ? null : item.name
                            )
                          }
                          className="group w-full flex items-center justify-between p-5 text-base font-bold transition-all duration-300 rounded-2xl border shadow-lg hover:shadow-2xl transform hover:scale-[1.02]"
                          style={{
                            backgroundColor: isActive
                              ? currentTheme.colors?.primaryAccent || "#3182ce"
                              : currentTheme.colors?.cardBg || "#ffffff",
                            color: isActive
                              ? "white"
                              : currentTheme.colors?.textPrimary || "#000000",
                            borderColor: isActive
                              ? currentTheme.colors?.primaryAccent || "#3182ce"
                              : currentTheme.colors?.borderPrimary || "#e2e8f0",
                          }}
                        >
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            {item.icon && (
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                                style={{
                                  backgroundColor: isActive
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : `${currentTheme.colors?.primaryAccent || "#3182ce"}20`,
                                  color: isActive
                                    ? "white"
                                    : currentTheme.colors?.primaryAccent ||
                                      "#3182ce",
                                }}
                              >
                                <item.icon className="w-6 h-6" />
                              </div>
                            )}
                            <div className="text-left rtl:text-right">
                              <span className="block text-lg">{item.name}</span>
                              <span
                                className="text-sm opacity-70"
                                style={{
                                  color: isActive
                                    ? "rgba(255, 255, 255, 0.8)"
                                    : currentTheme.colors?.textSecondary ||
                                      "#666666",
                                }}
                              >
                                انقر للتوسيع
                              </span>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-6 h-6 transition-all duration-300 group-hover:scale-110 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {/* Dropdown items could go here */}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="group flex items-center space-x-4 rtl:space-x-reverse p-5 text-base font-bold transition-all duration-300 rounded-2xl border shadow-lg hover:shadow-2xl transform hover:scale-[1.02]"
                        style={{
                          backgroundColor: isActive
                            ? currentTheme.colors?.primaryAccent || "#3182ce"
                            : currentTheme.colors?.cardBg || "#ffffff",
                          color: isActive
                            ? "white"
                            : currentTheme.colors?.textPrimary || "#000000",
                          borderColor: isActive
                            ? currentTheme.colors?.primaryAccent || "#3182ce"
                            : currentTheme.colors?.borderPrimary || "#e2e8f0",
                        }}
                        onClick={onClose}
                      >
                        {item.icon && (
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                            style={{
                              backgroundColor: isActive
                                ? "rgba(255, 255, 255, 0.2)"
                                : `${currentTheme.colors?.primaryAccent || "#3182ce"}20`,
                              color: isActive
                                ? "white"
                                : currentTheme.colors?.primaryAccent ||
                                  "#3182ce",
                            }}
                          >
                            <item.icon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 text-left rtl:text-right">
                          <span className="block text-lg">{item.name}</span>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ color: "red", padding: "20px", backgroundColor: "white" }}>
                لم يتم العثور على عناصر التنقل!
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

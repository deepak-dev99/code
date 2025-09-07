"use client";

import React, { useState, createContext, useContext } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for routing
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "../../lib/utils";

// Context to manage Sidebar state
const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// SidebarProvider manages state for the sidebar
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

// Desktop Sidebar Component
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-slate-900 border-r border-slate-800 w-[300px] flex-shrink-0 shadow-xl",
        className
      )}
      animate={{
        width: animate ? (open ? "200px" : "60px") : "200px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Mobile Sidebar Component
export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className="h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-slate-900 border-b border-slate-800 w-full shadow-lg"
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-slate-200 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-slate-900 p-10 z-[100] flex flex-col justify-between shadow-2xl",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-slate-200 hover:text-orange-400 transition-colors duration-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Sidebar Link Component
export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();
  return (
    <NavLink 
      onClick={props.action ? props.action : () => { }}
      to={link.href} // Use NavLink for routing
      className={({ isActive }) =>
        cn(
          "flex items-center justify-start gap-2 group/sidebar py-3 px-2 rounded-lg transition-all duration-200 mb-1",
          isActive 
            ? "bg-orange-500/20 border-l-4 border-orange-400 text-orange-400" 
            : "text-slate-300 hover:bg-slate-800 hover:text-orange-400 hover:translate-x-1",
          className
        )
      }
      {...props}
    >
      <span className={cn(
        "transition-colors duration-200",
        "group-hover/sidebar:text-orange-400"
      )}>
        {link.icon}
      </span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm font-medium group-hover/sidebar:translate-x-1 transition-all duration-200 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </NavLink>
  );
};
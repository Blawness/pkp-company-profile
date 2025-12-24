import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/NavigationMenu";

describe("UI Components", () => {
  describe("Accordion", () => {
    test("renders accordion items and triggers", () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByText("Trigger 1")).toBeInTheDocument();
    });
  });

  describe("NavigationMenu", () => {
    test("renders navigation links", () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/test">Test Link</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
      );

      const link = screen.getByText("Test Link");
      expect(link).toBeInTheDocument();
      expect(link.getAttribute("href")).toBe("/test");
    });
  });
});

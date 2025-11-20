import type { CanvasElement } from "@/types/element.types";
import { HeaderElement } from "./header-element";
import { FooterElement } from "./footer-element";
import { CardElement } from "./card-element";
import { TextContentElement } from "./text-content-element";
import { SliderElement } from "./slider-element";

type ElementRendererProps = {
  readonly element: CanvasElement;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
};

export function ElementRenderer({ element, isSelected, onSelect }: ElementRendererProps) {
  switch (element.type) {
    case "header":
      return <HeaderElement element={element} isSelected={isSelected} onSelect={onSelect} />;
    case "footer":
      return <FooterElement element={element} isSelected={isSelected} onSelect={onSelect} />;
    case "card":
      return <CardElement element={element} isSelected={isSelected} onSelect={onSelect} />;
    case "text-content":
      return <TextContentElement element={element} isSelected={isSelected} onSelect={onSelect} />;
    case "slider":
      return <SliderElement element={element} isSelected={isSelected} onSelect={onSelect} />;
    default:
      return null;
  }
}


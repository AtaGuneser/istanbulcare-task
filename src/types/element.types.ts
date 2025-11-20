export type ElementType = "header" | "footer" | "card" | "text-content" | "slider";

export type Position = {
  readonly x: number | string;
  readonly y: number | string;
  readonly width: number | string;
  readonly height: number | string;
  readonly zIndex: number;
  readonly fixed?: boolean;
};

export type ResponsivePosition = {
  readonly mobile?: Partial<Position>;
  readonly tablet?: Partial<Position>;
};

export type ElementContent = {
  readonly text?: string;
  readonly title?: string;
  readonly description?: string;
  readonly html?: string;
  readonly plainText?: string;
  readonly image?: string | null;
  readonly copyright?: string;
  readonly links?: readonly string[];
  readonly style?: string;
};

export type CanvasElement = {
  readonly id: string;
  readonly type: ElementType;
  readonly content: ElementContent;
  readonly position: Position;
  readonly responsive?: ResponsivePosition;
};

export type CanvasGrid = {
  readonly enabled: boolean;
  readonly size: number;
  readonly snap: boolean;
};

export type CanvasConfig = {
  readonly width: number;
  readonly height: number;
  readonly grid: CanvasGrid;
};

export type ProjectMetadata = {
  readonly name: string;
  readonly version: string;
  readonly created: string;
  readonly lastModified: string;
};

export type ProjectExport = {
  readonly project: ProjectMetadata;
  readonly canvas: CanvasConfig;
  readonly elements: readonly CanvasElement[];
  readonly metadata: {
    readonly totalElements: number;
    readonly exportFormat: string;
    readonly exportVersion: string;
  };
};


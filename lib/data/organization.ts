export type OrgNode = {
  titleKey?: string;
  name?: string;
  children?: OrgNode[];
};

// This is now mostly structural; actual titles come from translations
export const organization: OrgNode = {
  children: [
    {
      children: [{}, {}],
    },
    {
      children: [{}, {}],
    },
    {
      children: [{}, {}],
    },
  ],
};

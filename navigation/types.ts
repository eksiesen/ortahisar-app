export type RootTabParamList = {
  Home: undefined;
  Transport:
    | {
        detailKey?: 'dolmus' | 'taksi' | 'otobus' | 'havalimani' | 'havas';
      }
    | undefined;
  Places:
    | {
        categoryKey?: 'dogal' | 'tarihi' | 'park' | 'manzara' | 'isletme';
        detailKey?: string;
      }
    | undefined;
};

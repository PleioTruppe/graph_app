import { emptySplitApi as api } from './appBaseApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    autocompleteApiAppAutocompleteGet: build.query<AutocompleteApiAppAutocompleteGetApiResponse, AutocompleteApiAppAutocompleteGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/autocomplete`, params: { search: queryArg.search, limit: queryArg.limit } }),
    }),
    gene2GenesApiAppGene2GenesGet: build.query<Gene2GenesApiAppGene2GenesGetApiResponse, Gene2GenesApiAppGene2GenesGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/gene2genes`, params: { gene: queryArg.gene, limit: queryArg.limit } }),
    }),
    gene2DiseasesApiAppGene2DiseasesGet: build.query<Gene2DiseasesApiAppGene2DiseasesGetApiResponse, Gene2DiseasesApiAppGene2DiseasesGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/gene2diseases`, params: { gene: queryArg.gene, limit: queryArg.limit } }),
    }),
    gene2DrugsApiAppGene2DrugsGet: build.query<Gene2DrugsApiAppGene2DrugsGetApiResponse, Gene2DrugsApiAppGene2DrugsGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/gene2drugs`, params: { gene: queryArg.gene, limit: queryArg.limit } }),
    }),
    trait2GenesApiAppTrait2GenesGet: build.query<Trait2GenesApiAppTrait2GenesGetApiResponse, Trait2GenesApiAppTrait2GenesGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/trait2genes`, params: { disease: queryArg.disease, limit: queryArg.limit } }),
    }),
    singleGeneApiAppGeneGet: build.query<SingleGeneApiAppGeneGetApiResponse, SingleGeneApiAppGeneGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/gene`, params: { gene: queryArg.gene } }),
    }),
    gene2AllApiAppGene2AllGet: build.query<Gene2AllApiAppGene2AllGetApiResponse, Gene2AllApiAppGene2AllGetApiArg>({
      query: (queryArg) => ({ url: `http://127.0.0.1:9000/api/app/gene2all`, params: { gene: queryArg.gene, limit: queryArg.limit } }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedAppApi };
export type AutocompleteApiAppAutocompleteGetApiResponse = /** status 200 Successful Response */ string[];
export type AutocompleteApiAppAutocompleteGetApiArg = {
  search: string;
  limit?: number;
};
export type Gene2GenesApiAppGene2GenesGetApiResponse = /** status 200 Successful Response */ GeneResponse[];
export type Gene2GenesApiAppGene2GenesGetApiArg = {
  gene?: string;
  limit?: number;
};
export type Gene2DiseasesApiAppGene2DiseasesGetApiResponse = /** status 200 Successful Response */ TraitResponse[];
export type Gene2DiseasesApiAppGene2DiseasesGetApiArg = {
  gene?: string;
  limit?: number;
};
export type Gene2DrugsApiAppGene2DrugsGetApiResponse = /** status 200 Successful Response */ TraitResponse[];
export type Gene2DrugsApiAppGene2DrugsGetApiArg = {
  gene?: string;
  limit?: number;
};
export type Trait2GenesApiAppTrait2GenesGetApiResponse = /** status 200 Successful Response */ TraitResponse[];
export type Trait2GenesApiAppTrait2GenesGetApiArg = {
  disease?: string;
  limit?: number;
};
export type SingleGeneApiAppGeneGetApiResponse = /** status 200 Successful Response */ GeneResponse[];
export type SingleGeneApiAppGeneGetApiArg = {
  gene: string;
};
export type Gene2AllApiAppGene2AllGetApiResponse = /** status 200 Successful Response */ Gene2AllResponse;
export type Gene2AllApiAppGene2AllGetApiArg = {
  gene?: string;
  limit?: number;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type GeneResponse = {
  ENSG_A: string;
  ENSG_B: string;
  combined_score: number;
  ENSG_A_name: string;
  ENSG_B_name: string;
};
export type TraitResponse = {
  gene: string;
  padj: number;
  disease: string;
  gene_name: string;
};
export type PositionType = {
  x: number;
  y: number;
};
export type NodeType = 1 | 2 | 3;
export type Node = {
  id: string;
  entrezId: number;
  name: string;
  summary: string;
  synonyms: string[];
  position: PositionType;
  type: NodeType;
};
export type Edge = {
  id: string;
  source: string;
  target: string;
};
export type Gene2AllResponse = {
  nodes: Node[];
  edges: Edge[];
};
export const {
  useAutocompleteApiAppAutocompleteGetQuery,
  useLazyAutocompleteApiAppAutocompleteGetQuery,
  useGene2GenesApiAppGene2GenesGetQuery,
  useLazyGene2GenesApiAppGene2GenesGetQuery,
  useGene2DiseasesApiAppGene2DiseasesGetQuery,
  useLazyGene2DiseasesApiAppGene2DiseasesGetQuery,
  useGene2DrugsApiAppGene2DrugsGetQuery,
  useLazyGene2DrugsApiAppGene2DrugsGetQuery,
  useTrait2GenesApiAppTrait2GenesGetQuery,
  useLazyTrait2GenesApiAppTrait2GenesGetQuery,
  useSingleGeneApiAppGeneGetQuery,
  useLazySingleGeneApiAppGeneGetQuery,
  useGene2AllApiAppGene2AllGetQuery,
  useLazyGene2AllApiAppGene2AllGetQuery,
} = injectedRtkApi;

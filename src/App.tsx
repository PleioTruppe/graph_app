import { Autocomplete, Loader } from '@mantine/core';
import React, { useState } from 'react';
import { useAutocomplete } from './store/store';
import { GeneGraph } from './GeneGraph';
import MolViewer from './MolViewer';

export function App() {
  const [search, setSearch] = useState('');
  const { data: autocompleteData, isFetching } = useAutocomplete({ search });


  return (
    <>
      {/* <Autocomplete
        label="Search for genes"
        placeholder="ENSG..."
        value={search}
        onChange={setSearch}
        data={autocompleteData || []}
        rightSection={isFetching ? <Loader size="sm" /> : null}
      />

      <GeneGraph geneID={search} /> */}
      {/* <MolViewer entrez_id={'64102'} /> */}
      <MolViewer entrez_id={'63923'} />
      {/* <MolViewer entrez_id={'100128262'} /> */}
      {/* <MolViewer entrez_id={'23043'} /> */}
      {/* <MolViewer entrez_id={'ENSG00000000005'} /> */}
      {/* <MolViewer entrez_id={'ENSG00000120659'} /> */}
    </>
  );
}
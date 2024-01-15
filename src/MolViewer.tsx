import React, { useEffect, useRef, useCallback } from 'react';
import { Viewer, ViewerOptions } from 'molstar/build/viewer/molstar';

interface MolViewerProps {
  options?: Partial<ViewerOptions>;
  entrez_id?: string;
}

function MolViewer({ options, entrez_id }: MolViewerProps) {
  const viewerRef = useRef<Viewer | null>(null);
  const isMountedRef = useRef(false);

  const fetchUniProtId = useCallback(async (entrezId: string) => {
    try {
      const response = await fetch(`https://mygene.info/v3/gene/${entrezId}?fields=uniprot&dotfield=false&size=10`);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data?.uniprot?.['Swiss-Prot'] || null;
    } catch (error) {
      return null;
    }
  }, []);

  const fetchAlphaFoldData = useCallback(async (uniProtId: string | null) => {
    try {
      const response = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${uniProtId}?key=key`);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data?.[0]?.cifUrl || null;
    } catch (error) {
      return null;
    }
  }, []);

  const loadStructure = useCallback(async (cifUrl: string | null) => {
    if (isMountedRef.current && cifUrl) {
      try {
        await viewerRef.current?.loadStructureFromUrl(cifUrl);
      } catch (error) {
        // Do nothing
      }
    }
  }, []);

  useEffect(() => { 
    isMountedRef.current = true;

    const initViewer = async () => {
      if (isMountedRef.current) {
        try {
          const molstarContainer = document.getElementById('mol-container');

          if (molstarContainer && entrez_id) {
            const uniProtId = await fetchUniProtId(entrez_id);
            
            if (uniProtId === null) {
              return;
            }

            const cifUrl = await fetchAlphaFoldData(uniProtId);

            if (cifUrl === null) {
              return;
            }

            const viewerOptions: Partial<ViewerOptions> = {
              ...options,
              layoutShowControls: false,
              layoutIsExpanded: false,
              layoutShowLog: false,
              viewportShowExpand: true,
              viewportShowAnimation: true,
            };

            const viewer = await Viewer.create('mol-container', viewerOptions);
            viewerRef.current = viewer;

            if (viewer && viewerRef.current.plugin.builders.structure) {
              await loadStructure(cifUrl);
            }
          }
        } catch (error) {
          // Do nothing
        }
      }
    };

    initViewer();

    return () => {
      isMountedRef.current = false;
      viewerRef.current = null;
    };
  }, [options, entrez_id, fetchUniProtId, fetchAlphaFoldData, loadStructure]);

  return <div id="mol-container" style={{ width: '50px', height: '50px' }} />;
}

export default MolViewer;

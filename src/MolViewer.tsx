import React, { useEffect, useRef, useCallback } from 'react';
import { Viewer, ViewerOptions } from 'molstar/build/viewer/molstar';

interface MolViewerProps {
  options?: Partial<ViewerOptions>;
}

const MolViewer: React.FC<MolViewerProps> = ({ options }) => {
  const viewerRef = useRef<Viewer | null>(null);
  const isMountedRef = useRef(false);

  const loadPdbFile = useCallback(async (pdbFileName: string) => {
    if (isMountedRef.current) {
      try {
        const pdbFilePath = require(`./${pdbFileName}`);
    
        console.log('Loading PDB file:', pdbFilePath);
        await viewerRef.current?.loadPdb(pdbFilePath);

        console.log('PDB file loaded successfully');

      } catch (error) {
          console.error('Error loading PDB file:', error);
      } 
  }
  }, []);

  useEffect(() => {

    isMountedRef.current = true;

    const initViewer = async () => {
      if (isMountedRef.current) {
        try {
          const viewer = await Viewer.create('mol-container', options);
          viewerRef.current = viewer;

          console.log('Viewer created successfully');
          console.log('Plugin builders:', viewerRef.current.plugin.builders);

          if (viewerRef.current && isMountedRef.current) {
            await viewerRef.current.plugin.builders.structure;

            if (viewerRef.current.plugin.builders.structure  && isMountedRef.current) {
              await loadPdbFile('AF-Q9H2S6-F1-model_v4.pdb');
            }
          } else {
              console.error('Error: Viewer not successfully initialized.');
          }
        } catch (error) {
            console.error('Error initializing viewer:', error);
        }
    }
    };

    initViewer();

    return () => {
      isMountedRef.current = false;
    };
  }, [options, loadPdbFile]);

  return <div id="mol-container" style={{ width: '250px', height: '250px' }} />;
};

export default MolViewer;

import React, { useEffect, useRef } from 'react';
import { Viewer, ViewerOptions } from 'molstar/build/viewer/molstar';

interface MolViewerProps {
  options?: Partial<ViewerOptions>;
}

const MolViewer: React.FC<MolViewerProps> = ({ options }) => {
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    const initViewer = async () => {
      try {
        // initializing the viewer
        const viewer = await Viewer.create('mol-container', options);
        viewerRef.current = viewer;

        console.log('Viewer created successfully');
        console.log('Plugin builders:', viewerRef.current.plugin.builders);

        if (viewerRef.current) {
          await viewerRef.current.plugin.builders.structure.createModel();

          if (viewerRef.current.plugin.builders.structure) {
              // loading pdb-File
              await loadPdbFile('AF-Q9H2S6-F1-model_v4.pdb');
          }
        } else {
        console.error('Error: Viewer not successfully initialized.');
        }
      } catch (error) {
        console.error('Error initializing viewer:', error);
      }
    };  

    initViewer();
  }, [options]);

  const loadPdbFile = async (pdbFileName: string) => {
    try {
        const pdbFilePath = require(`./${pdbFileName}`);

        console.log('Loading PDB file:', pdbFilePath);
        // loading pdb-File into viewer
        await viewerRef.current?.loadPdb(pdbFilePath);

        console.log('PDB file loaded successfully');
    } catch (error) {
        console.error('Error loading PDB file:', error);
    }
  };

  return <div id="mol-container" style={{ width: '250px', height: '250px' }} />;
};

export default MolViewer;
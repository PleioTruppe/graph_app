import React, { useState, useEffect, useRef } from 'react';
import dagre from 'dagre';
import { useAutocomplete,useGene2Drugs, useGene2Genes } from './store/store';
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import cytoscape from 'cytoscape';
import GeneNode from './GeneNode';
import { Gene2GenesApiAppGene2GenesGetApiResponse, GraphResponse } from './store/generatedAppApi';


const nodeWidth = 172;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges) => {

    dagreGraph.setGraph({ rankdir: 'TB',align: 'UL' })

    nodes?.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges?.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre?.layout(dagreGraph);

    nodes?.forEach((node) => {

      const nodeWithPosition = dagreGraph.node(node.id);

      node.targetPosition = 'top';
      node.sourcePosition = 'bottom';

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
};

type GeneGraphProps={
    genes: Gene2GenesApiAppGene2GenesGetApiResponse
}

export function GeneGraph(props: GeneGraphProps) {
     
      // add nodes
      const nodes = props.genes?.map(node => ({
        id: node.ENSG_B,
        position: {
            x: Math.random() * 700,
            y: Math.random() * 700,},
        data: {label: node.ENSG_B_name}
      }))


    //   if(props.genes != undefined){
    //     nodes.concat([({
    //         id: props.genes[0]["ENSG_A"],
    //         position: {
    //             x: Math.random() * 700,
    //             y: Math.random() * 700,},
    //         data: {label: props.genes[0]["ENSG_A_name"]}
    //       })])
    //   }

    
    
      // TODO originNodeId = parameter of function
      const edges = props.genes?.map(edge => ({
        id: edge.ENSG_A + "-" + edge.ENSG_B,
        source: edge.ENSG_A,
        target: edge.ENSG_B
      }))
    
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges
      );


  return (
    <div style={{ height: '100%' }}>
      <ReactFlow nodes={layoutedNodes} edges={layoutedEdges} > 
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}


import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import { useExpand } from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from "./NodeTypes";
import FloatingEdge from './EdgeType';
import FloatingConnectionLine from './FloatingConnectionLine';
import { SidebarFilterList } from './SidebarFilterList';

import ELK from 'elkjs/lib/elk.bundled.js';
import { tree } from 'd3';


export const NodesContext = React.createContext(null)

const edgeTypes = {
  floating: FloatingEdge,
};

// Props for the GeneGraph component
type GeneGraphProps = {
  geneID: string[]; // changed to array
  setIds;
  toggleLoading;
};


//get elk instance 
const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  //set parameters for elk
  const defaultOptions = {
    'elk.algorithm': 'org.eclipse.elk.force',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getLayoutedElements = useCallback(() => {
    //get nodes and edges from reactflow
    const layoutOptions = { ...defaultOptions };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes(),
      edges: getEdges(),
    };

    //layout graph
    elk.layout(graph as any).then(({ children }) => {

      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      //settin positions
      children.forEach((node) => {
        (node as any).position = { x: node.x, y: node.y };
      });

      setNodes(children as any);

    });
  }, []);

  //return callback
  return { getLayoutedElements };
};


// GeneGraph component
export function GeneGraph(props: GeneGraphProps) {
  let geneIds = props.geneID;

  // state for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  //reset nodes if none are querried
  if (props?.geneID?.length == 0 && nodes?.length != 0) {
    setNodes([]);
  }

  //set layouting states
  let fixedIds = []
  const { getLayoutedElements } = useLayoutedElements();
  const [curNodes, setCurNodes] = useState(0);
  const [isFitted, setFittet] = useState(false);



  // get all genes that are connected to the first node
  let { data: graph } = useExpand({
    geneIds: geneIds,
    fixedGeneIds: fixedIds,
    limit: 1000,
  });

  const { getNodes, fitView } = useReactFlow();

  //layout when current nodes change
  useEffect(() => {
    if (curNodes != 0) {
      getLayoutedElements();
      setFittet(false);
    }
  }, [curNodes]);


  //react to reactflow nodechange
  useMemo(() => {
    //set current nodes 
    if (getNodes()?.length != curNodes && getNodes()[0]?.width != null) {
      setCurNodes(getNodes().length)
    }
    //fit if nodes have been layouted -> unfortunatly a timeout is neccessary otherwise it will fit too early
    if (getNodes()?.length != 0 && getNodes()[0].position.x != 0 && !isFitted) {
      props.toggleLoading(false)
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          fitView({
            maxZoom: 15,
            minZoom: 0.1,
            duration: 5000,
            nodes: getNodes()
          });
        })
      }, 1)
      setFittet(true);
    }

  }, [getNodes()]);


  useMemo(() => {

    //set loading status on first execution
    if (props.geneID.length > 0) {
      props.toggleLoading(true)
    }

    setCurNodes(0);

    //use viewtransition api
    (document as any).startViewTransition(() => {

      //set nodes with data from backend
      setNodes(graph?.nodes.map((node, index) => {
        return {
          id: node.id,
          position: {
            x: (node.position.x + 1) * (window.innerWidth / 2),
            y: (node.position.y + 1) * (window.innerHeight / 2)
          },
          data: {
            label: node.symbol == "nan" ? node.id : node.symbol,
            displayProps: {
              fullname: node.name,
              synonyms: node.synonyms,
              entrezId: node.entrezId,
              ensemblId: node.symbol == "nan" ? node.symbol : node.id,
              label: node.symbol == "nan" ? node.id : node.symbol,
              summary: node.summary,
            },
            children: node.children,
            parents: node.parents,
            isRoot: props.geneID.includes(node.id) ? true : false,
            type: node.type,
            onExpand: exp,
            onCollapse: coll
          },
          type: "node",
          selected: false,
        }
      }));

      //set Edges with data from backend
      setEdges(
        graph?.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'floating',
        }))
      );

    })

  }, [graph]);

  //add id of expanding node to geneids
  function exp(id: string) {
    if (!geneIds.includes(id)) {
      geneIds = ([...geneIds, id])
      props.setIds(geneIds)
    }
  }

  //collapse function
  function coll(id: string, children: [string]) {
    geneIds = geneIds.filter(geneId => geneId != id)
    let currentNodes = getNodes();
    currentNodes.forEach((child) => {
      child.data.parents = child.data.parents.filter((parent: string) => parent != id)
      if (child.id == id) {
        child.data.children = []
        child.data.isRoot = false
      }
    })

    var removeChildren = currentNodes.filter(node => children.includes(node.id))
    removeChildren = removeChildren.filter(node => node.data?.parents.length == 0)
    currentNodes = currentNodes.filter(node => !removeChildren.includes(node))
    setNodes(currentNodes)
  }

  return (
    <div style={{ height: '85vh', width: '100%', display: 'flex' }}>
      <ReactFlow
        multiSelectionKeyCode="Control"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineComponent={FloatingConnectionLine}
        maxZoom={15}
        minZoom={0.1}
        fitView
        onPaneClick={(event) => {
          event.preventDefault();

          // Set all nodes as selected using a Promise
          Promise.resolve().then(() => {
            setNodes((prevNodes) =>
              prevNodes.map((node) => ({
                ...node,
                selected: false,
              }))
            );
          });
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div style={{maxWidth: '25%', minWidth:'25%'}}>
      <NodesContext.Provider value={{ nodes: nodes, setNodes: setNodes }}>
        <SidebarFilterList />
      </NodesContext.Provider>
      </div>
    </div >
  );
}
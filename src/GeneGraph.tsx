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


const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'org.eclipse.elk.force',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getLayoutedElements = useCallback(() => {
    const layoutOptions = { ...defaultOptions };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes(),
      edges: getEdges(),
    };

    elk.layout(graph as any).then(({ children }) => {

      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children.forEach((node) => {
        (node as any).position = { x: node.x, y: node.y };
      });

      setNodes(children as any);

    });
  }, []);

  return { getLayoutedElements };
};


// GeneGraph component
export function GeneGraph(props: GeneGraphProps) {
  let geneIds = props.geneID;

  // state for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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

  const { getNodes, fitView, getEdges } = useReactFlow();

  useEffect(() => {
    if (curNodes != 0) {
      getLayoutedElements();
      setFittet(false);
    }
  }, [curNodes]);


  useMemo(() => {
    if (getNodes()?.length != curNodes) {
      setCurNodes(getNodes().length)
    }
    if (getNodes()?.length != 0 && getNodes()[0].position.x != 0 && !isFitted) {
      props.toggleLoading(false)
      window.requestAnimationFrame(() => {
        fitView({
          maxZoom: 15,
          minZoom: 0.1,
          duration: 5000,
          nodes: getNodes()
        });
      })
      setFittet(true);
    }

  }, [nodes]);


  // useEffect(()=>{
  //   console.log("setfitted "+isFitted)
  //   if(!isFitted){
  //     console.log("nodes "+getNodes().length)
  //     window.requestAnimationFrame(() => {
  //       fitView({
  //         maxZoom: 15,
  //         minZoom: 0.1,
  //         duration: 5000,
  //         nodes: getNodes()
  //       });
  //     });
  //     console.log("if fittet")
  //     setFittet(true);
  //   }
  // },[isFitted])

  useMemo(() => {

    if (props.geneID.length > 0) {
      props.toggleLoading(true)
    }

    setCurNodes(0);
    (document as any).startViewTransition(() => {

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
          selected: true,
        }
      }));

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

  function exp(id: string) {
    if (!geneIds.includes(id)) {
      geneIds = ([...geneIds, id])
      props.setIds(geneIds)
    }
  }

  function coll(id: string, children: [string]) {
    geneIds = geneIds.filter(geneId => geneId != id)
    //props.setIds(geneIds)
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
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <NodesContext.Provider value={{ nodes: nodes, setNodes: setNodes }}>
        <SidebarFilterList />
      </NodesContext.Provider>
    </div >
  );
}
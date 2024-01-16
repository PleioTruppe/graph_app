import shownIcon from './images/eye.png'
import hiddenIcon from './images/eye-closed.png'

export const onNodesVisibilityChange = (reactflow, nodes, visible)=> {
    // update node state
    const updatedNodes = reactflow.getNodes().map((node) => {

        if (nodes.some(n => n.id === node.id)) {
            return { ...node, hidden: visible }
        }

        return node
    })

    // update edge state
    const updatedEdges = reactflow.getEdges().map((edge) => {
        // make them visible
        if (visible === true) {
            if ((nodes.some(n => n.id == edge.source) || nodes.some(n => n.id === edge.target))) {
                return {...edge, hidden: visible}
            }
        } else {
            // hide edges based on shown nodes
            var leftNode = nodes.some(n => n.id == edge.source);
            var rightNode = nodes.some(n => n.id === edge.target);
            
            if (leftNode && rightNode) {
                return {...edge, hidden: false}
            } else if (leftNode && !rightNode) {
                var allNodes = reactflow.getNodes()
                var rightNode = allNodes.find(n => n.id === edge.target)
                if (rightNode.hidden) {
                    return {...edge, hidden: true}
                } else {
                    return {...edge, hidden: false}
                }
            } else if (!leftNode && rightNode) {
                var allNodes = reactflow.getNodes()
                var leftNode = allNodes.find(n => n.id === edge.source)
                if (leftNode.hidden) {
                    return {...edge, hidden: true}
                } else {
                    return {...edge, hidden: false}
                }
            } 
        }

        return edge
    })

    // get updated images for each nodes that should be hidden
    updatedNodes.forEach(node => {
        
        const image = node.hidden ? hiddenIcon : shownIcon

        //document.getElementById(node.id + "_icon").setAttribute('src', image)
    });

    reactflow.setNodes(updatedNodes)
    reactflow.setEdges(updatedEdges)
}

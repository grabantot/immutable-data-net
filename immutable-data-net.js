const assert = require('assert')
const { Graph } = require('data-net')

const updArr = (old, updates, matchField) => {
  const new_ = old.map(el => {
    const update = updates.find(upd => upd[matchField] === el[matchField])
    if (!update) return el
    return update
  })
  return new_
}

const remArr = (old, updates, matchField) => {
  const matchVals = updates.map(upd => upd[matchField])
  const new_ = old.filter(el => !matchVals.includes(el[matchField]))
  return new_
}


const add = (old, type, nsOrEs) => {
  if (nsOrEs.length === 0) return old
  const upds = nsOrEs.map(x => ({...x}))
  return old.concat(upds)
}

const rem = (old, nsOrEs) => {
  if (nsOrEs.length === 0) return old
  const upds = nsOrEs.map(x => ({...x}))
  return remArr(old, upds, 'id')
}

const upd = (old, nsOrEs) => {
  if (nsOrEs.length === 0) return old
  const upds = nsOrEs.map(x => ({...x}))
  return updArr(old, upds, 'id')
}

class ImmutableGraph extends Graph {
  constructor(...args) {
    super(...args)
    this.immutable = {
      nodes: add([], this.nodes),
      edges: add([], this.edges),
    }
  }

  addNode(...args) {
    const node = {...super.node(...args)}
    const old = this.immutable
    const new_ = {
      nodes: add(old.nodes, node),
      edges: old.edges,
    }
    this.immutable = new_
  }

  addEdge(...args) {
    const edge = {...super.edge(...args)}
    const old = this.immutable
    const new_ = {
      nodes: upd(old.nodes, [edge.from, edge.to]),
      edges: add(old.edges, [edge]),
    }
    this.immutable = new_
  }

  removeNode(id) {
    const node = this.nodes.find(n => n.id === id)
    assert(node, 'Node not found')
    node.remove()
    const old = this.immutable
    const new_ = {
      nodes: rem(old.nodes, [node]),
      edges: rem(old.edges, node.edges)
    }
    this.immutable = new_
  }

  removeEdge(id) {
    const edge = this.edges.find(e => e.id === id)
    assert(edge, 'Edge not found')
    edge.remove()
    const old = this.immutable
    const new_ = {
      nodes: old.nodes,
      edges: rem(old.edges, [edge]),
    }
    this.immutable = new_
  }

  updateNode(id, data) {
    const node = this.nodes.find(n => n.id === id)
    assert(node, 'Node not found')
    if (node.data === data) return
    node.data = data
    const old = this.immutable
    const new_ = {
      nodes: upd(old.nodes, [node]),
      edges: old.edges,
    }
    this.immutable = new_
  }

  updateEdge(id, data) {
    const edge = this.edges.find(e => e.id === id)
    assert(edge, 'Edge not found')
    if (edge.data === data) return
    edge.data = data
    const old = this.immutable
    const new_ = {
      nodes: old.nodes,
      edges: upd(old.edges, [edge]),
    }
    this.immutable = new_
  }
}

module.exports = ImmutableGraph
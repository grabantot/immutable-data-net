/* global describe, it */
let chai = require('chai')
let expect = chai.expect
let ImmutableGraph = require('..')

describe('ImmutableGraph', () => {
  it('should add edge to nodes', () => {
    const gs = []
    const gr = ImmutableGraph.create()
    gs.push(gr.immutable)
    gr.addNode('node')
    gs.push(gr.immutable)
    gr.addNode({x: 15})
    gs.push(gr.immutable)
    gr.addEdge(gr.nodes[0].id, gr.nodes[1].id, {type: 'one-way'})
    gs.push(gr.immutable)

    // gs.forEach((g, i) => console.log(i, g))
    expect(gs[3].nodes[0].edges[0].id).to.equal(gs[3].nodes[1].edges[0].id)
    expect(gs[3].nodes[0].edges[0].id).to.equal(gs[3].edges[0].id)
  })

  it('should work', () => {
    const gs = []
    const gr = ImmutableGraph.create()
    gs.push(gr.immutable)
    gr.addNode('node')
    gs.push(gr.immutable)
    gr.updateNode(gr.nodes[0].id, 'node updated')
    gs.push(gr.immutable)
    gr.addNode({x: 15})
    gs.push(gr.immutable)
    gr.addNode(666)
    gs.push(gr.immutable)
    gr.addEdge(gr.nodes[0].id, gr.nodes[1].id, {type: 'one-way'})
    gs.push(gr.immutable)
    gr.updateEdge(gr.edges[0].id, {type: 'two-ways'})
    gs.push(gr.immutable)
    gr.addEdge(gr.nodes[1].id, gr.nodes[2].id, 'edge')
    gs.push(gr.immutable)
    gr.removeNode(gr.nodes[2].id)
    gs.push(gr.immutable)
    gr.removeEdge(gr.edges[0].id)
    gs.push(gr.immutable)

    gs.forEach((g, i) => console.log(i, g))
    expect(gs[9].nodes[0].edges.length).to.equal(0)
    expect(gs[9].nodes[1].edges.length).to.equal(0)
  })
})
#!/usr/bin/env ruby

require 'graphviz'

g = GraphViz.new :G, type: :digraph

hello = g.add_nodes "hello"
world = g.add_nodes "world"

g.add_edges hello, world
g.add_edges world, hello

g.output png: "foo/hello.png"

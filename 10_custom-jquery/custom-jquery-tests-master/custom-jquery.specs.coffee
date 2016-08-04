fs        = require 'fs'
_         = require 'lodash'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
should    = do chai.should
{jsdom}   = require 'jsdom'

chai.use sinonChai

$wrapper = null
wrapper = null

doc = do jsdom

global.window = doc.defaultView
(require './polyfills/classList.js') window

_.merge global, window

require './polyfills/dataset.js'

{pathToSolution} = require './config.json'
require pathToSolution

_.merge global, window

wrapper = null
$wrapper = null

children = null
$children = null

nodeToAppend = null

singleClassName = 'foo'
multipleClassNames = 'foo bar'

callback = `function (index, className) {
          return index % 2 ? 'foo bar' : 'foo'
      }`

text = 'some text'
tagName = 'p'
html = "<#{tagName}>#{text}</#{tagName}>"

prepareDOM = ->
	wrapper = document.createElement 'div'
	wrapper.classList.add 'wrapper'

	for i in [0..9]
		child = document.createElement 'div'
		child.classList.add 'child'
		wrapper.appendChild child

	document.body.innerHTML = ''
	document.body.appendChild wrapper
	$wrapper = $ '.wrapper'
	children = wrapper.children
	$children = $ '.child'

	nodeToAppend = document.createElement tagName
	nodeToAppend.innerHTML = text

beforeEach prepareDOM

describe '#addClass', ->
	describe "$('.wrapper').addClass('#{singleClassName}')", ->
		it "should add class #{singleClassName} to wrapper", ->
			$wrapper.addClass "#{singleClassName}"
			wrapper.classList.contains "#{singleClassName}"
				.should.equal yes

	describe "$('.wrapper').addClass('#{multipleClassNames}')", ->
		it "should add both #{multipleClassNames.split(' ').join(' and ')} classes to wrapper", ->
			$wrapper.addClass 'foo bar'

			wrapper.classList.contains 'foo'
				.should.equal yes
			wrapper.classList.contains 'bar'
				.should.equal yes

	describe "$('.wrapper').addClass(#{callback})", ->
		it 'should pass to callback index and classname of node', ->
			spy = do sinon.spy
			$wrapper.addClass spy

			spy.should.have.been.calledWith 0, 'wrapper'

		it "should add class 'foo' to wrapper", ->
			$wrapper.addClass callback
			wrapper.classList.contains('foo').should.eql yes

	describe "$('.child').addClass('#{singleClassName}')", ->
		it "should add class #{singleClassName} to each of children", ->
			$children.addClass "#{singleClassName}"

			for child in children
				child.classList.contains "#{singleClassName}"
					.should.equal yes

	describe "$('.child').addClass('#{multipleClassNames}')", ->
		it "should add both #{multipleClassNames.split(' ').join(' and ')} classes to each of children", ->
			$children.addClass 'foo bar'

			for child in children
				child.classList.contains 'foo'
					.should.equal yes
				child.classList.contains 'bar'
					.should.equal yes

	describe "$('.child').addClass(#{callback})", ->
		it 'should pass to callback indices and classname of each children', ->
			spy = sinon.spy callback
			$children.addClass spy
			index = 0

			for child in children
				spyCall = spy.getCall index
				spyCall.should.have.been.calledWith index, 'child'
				index++

		it "should add class 'foo' to odd nodes and both 'foo' and 'bar' to even", ->
			$children.addClass callback
			index = 0

			for child in children
				child.classList.contains 'foo'
					.should.eql yes

				if index % 2 isnt 0
					child.classList.contains 'bar'
						.should.eql yes

describe '#append', ->
	describe "$('.wrapper').append(#{html})", ->
		it "should append #{html} to wrapper", ->
			$wrapper.append html
			[..., lastChild] = wrapper.children

			lastChild.tagName.toLowerCase()
				.should.eql tagName

			lastChild.innerHTML
				.should.eql text

	describe "$('.wrapper').append(node)", ->
		it "should append node to wrapper", ->
			$wrapper.append nodeToAppend
			[..., lastChild] = wrapper.children

			lastChild.tagName.toLowerCase()
				.should.eql tagName

			lastChild.innerHTML
				.should.eql text

	describe "$('.child').append(#{html})", ->
		it "should append #{html} to each child", ->
			$children.append html

			for child in children
				[..., lastChild] = child.children

				lastChild.tagName.toLowerCase()
					.should.eql tagName

				lastChild.innerHTML
					.should.eql text

	describe "$('.child').append(node)", ->
		it "should append node to each child", ->
			$children.append nodeToAppend

			for child in children
				[..., lastChild] = child.children

				lastChild.tagName.toLowerCase()
					.should.eql tagName

				lastChild.innerHTML
					.should.eql text

describe '#html', ->
	describe "$('.wrapper').html()", ->
		it "should return innerHTML of wrapper", ->
			$wrapper.html()
				.should.eql wrapper.innerHTML

	describe "$('.wrapper').html(#{html})", ->
		it "should set innerHTML of wrapper to #{html}", ->
			$wrapper.html(html)
			wrapper.innerHTML.should.eql html

	describe "$('.child').html()", ->
		it "should return html of first matched element", ->
			html = '<p>some html</p>'
			children[0].innerHTML = html

			$children.html()
				.should.eql html

	describe "$('.child').html(#{html})", ->
		it "should set innerHTML of each selected node to #{html}", ->
			$children.html(html)

			for child in children
				child.innerHTML.should.eql html

describe '#attr', ->
	describe "$('.wrapper').attr('class')", ->
		it "should return 'wrapper'", ->
			$wrapper.attr('class')
				.should.eql 'wrapper'

	describe "$('.wrapper').attr('name', 'my-name')", ->
		it "should set attribute name of wrapper to 'my-name'", ->
			$wrapper.attr('name', 'my-name')
			wrapper.getAttribute 'name'
				.should.eql 'my-name'

	describe "$('.child').attr('class')", ->
		it "should return class of first node", ->
			children[0].classList.add 'foo'
			$children.attr('class')
				.should.eql 'child foo'

	describe "$('.child').attr('name', 'my-name')", ->
		it "should set attribute name of each node to 'my-name'", ->
			$children.attr('name', 'my-name')

			for child in children
				child.getAttribute 'name'
					.should.eql 'my-name'

describe '#children', ->
	describe "$('.wrapper').children()", ->
		it 'should return collection of children of wrapper', ->
			$children = $wrapper.children()
			index = 0

			for child in $children
				child.should.eql children[index]
				index++

	describe "$('.wrapper').children('.foo')", ->
		it "should return all children containing class 'foo'", ->
			for i in [0..4]
				children[i * 2].classList.add 'foo'

			_children = $wrapper.children '.foo'
			_children.length.should.eql 5

			children = document.querySelectorAll '.foo'

			index = 0

			for child in _children
				child.should.eql children[index]
				index++

	describe "$('.child').children()", ->
		it 'should return collection of children of first matched node', ->
			__children = for i in [0..9]
				child = document.createElement 'div'
				children[0].appendChild child
				child

			_children = $children.children()
			index = 0

			for child in _children
				child.should.eql __children[index]
				index++

describe '#css', ->
	describe "$('.wrapper').css('color')", ->
		it 'should return inline color style of wrapper', ->
			wrapper.style.color = 'red'
			$wrapper.css 'color'
				.should.eql 'red'

	describe "$('.wrapper').css({color: 'red'})", ->
		it 'should set inline color style', ->
			$wrapper.css color:'red'
			wrapper.style.color.should.eql 'red'

	describe "$('.child').css('color')", ->
		it 'should return inline color style of first matched element', ->
			children[0].style.color = 'red'
			$children.css 'color'
				.should.eql 'red'

	describe "$('.child').css({color: 'red'})", ->
		it 'should set inline color style of each matched element', ->
			$children.css color:'red'

			for child in children
				child.style.color.should.eql 'red'

describe '#data', ->
	describe "$('.wrapper').data()", ->
		it 'should return data with all data attributes', ->
			wrapper.dataset.a = 1
			wrapper.dataset.b = 2

			$wrapper.data()
				.should.eql
					a: 1
					b: 2

	describe "$('.wrapper').data('foo')", ->
		it 'should return value of data-foo attribute', ->
			wrapper.dataset.foo = 1
			$wrapper.data('foo')
				.should.eql 1

	describe "$('.wrapper').data('foo', 1)", ->
		it 'should set data-foo to 1', ->
			$wrapper.data('foo', 1)

			wrapper.dataset.foo.should.eql 1

	describe "$('.wrapper').data({foo: 1, bar: 2})", ->
		it 'should set data-foo to 1 and data-bar to 2', ->
			$wrapper.data
				foo: 1
				bar: 2

			wrapper.dataset.foo.should.eql 1
			wrapper.dataset.bar.should.eql 2

	describe "$('.child').data('foo')", ->
		it 'should return value of data-foo attribute of first child', ->
			children[0].dataset.foo = 1
			$children.data('foo')
				.should.eql 1

	describe "$('.child').data('foo', 1)", ->
		it 'should set data-foo to 1 of all children', ->
			$children.data('foo', 1)

			for child in children
				child.dataset.foo.should.eql 1

	describe "$('.child').data({foo: 1, bar: 2})", ->
		it 'should set data-foo to 1 and data-bar to 2 of all children', ->
			$children.data
				foo: 1
				bar: 2

			for child in children
				child.dataset.foo.should.eql 1
				child.dataset.bar.should.eql 2

describe '#on', ->
	describe "$('.wrapper').on('click', callback)", ->
		it 'should add event listener to wrapper', ->
			callback = do sinon.spy
			$wrapper.on 'click', callback

			event = document.createEvent 'HTMLEvents'
			event.initEvent 'click', no, yes
			wrapper.dispatchEvent event

			callback.should.have.been.calledWith event

	describe "$('.wrapper').on('click', '.child', callback)", ->
		it 'should delegate event to child which matches to selector', ->

			callback = do sinon.spy
			$wrapper.on 'click', '.child', callback

			child = document.createElement 'div'
			child.classList.add 'child'

			wrapper.appendChild child

			event = document.createEvent 'HTMLEvents'
			event.initEvent 'click', yes, yes
			child.dispatchEvent event

			callback.should.have.been.called

	describe "$('.wrapper').on('click', '.child', callback)", ->
	it 'should not delegate event to child which does not match to selector', ->

		callback = do sinon.spy
		$wrapper.on 'click', '.child', callback

		child = document.createElement 'div'
		wrapper.appendChild child

		event = document.createEvent 'HTMLEvents'
		event.initEvent 'click', yes, yes
		child.dispatchEvent event

		callback.should.not.have.been.called

describe '#one', ->
	describe "$('.wrapper').one('click', handler)", ->
		it 'should add event listener that will be removed after first execution', ->
			handler = do sinon.spy

			$wrapper.one 'click', handler

			for i in [0..2]
				event = document.createEvent 'HTMLEvents'
				event.initEvent 'click', yes, yes
				wrapper.dispatchEvent event

			handler.should.have.been.calledOnce
	

describe '#each', ->
	describe "$('.child').each(function (index, element) { return 42; })", ->
		it 'should pass index of iteration and node to callback', ->
			spy = sinon.spy()

			$children.each spy

			index = 0
			for child in children
				spyCall = spy.getCall index
				spyCall.should.have.been.calledWith index, child
				spyCall.should.have.been.calledOn child
				index++

	describe """$('.child').each(function (index, element) {
	            if (index > 2) {
	                return false;
	            }
	        })
	""", ->
		it 'should stop looping if callback returned false', ->
			callback = (index) ->
				if index is 2
					no

			spy = sinon.spy callback
			$children.each spy

			spy.calledThrice.should.be.ok
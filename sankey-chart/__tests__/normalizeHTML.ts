import { Parser } from 'htmlparser2';
import { DomHandler, Element, Text, Comment, ProcessingInstruction, Node as DomNode } from 'domhandler';
import { ElementType } from 'domelementtype';

// Define types for HTML DOM nodes
type Node = Element | Text | Comment | ProcessingInstruction;

// Function to normalize HTML by parsing and cleaning it
function normalizeHTML(html: string): string {
  const handler = new DomHandler();
  const parser = new Parser(handler);

  parser.write(html);
  parser.end();

  return cleanHTML(handler.dom);
}

// Function to recursively clean and reconstruct HTML from nodes
function cleanHTML(dom: DomNode[]): string {
  if (!Array.isArray(dom)) {
    throw new TypeError("Expected 'dom' to be an array");
  }

  // Construct HTML string from the node array
  return dom.map(node => {
    if (isElement(node)) {
      // Sort attributes by name
      node.attribs = Object.fromEntries(
        Object.entries(node.attribs).sort(([a], [b]) => a.localeCompare(b))
      );

      // Recursively clean children
      const childrenHTML = cleanHTML(node.children as DomNode[]);
      // Return reconstructed HTML for this element
      return `<${node.name}${formatAttributes(node.attribs)}>${childrenHTML}</${node.name}>`;
    } else if (isText(node)) {
      return node.data;
    } else if (isComment(node)) {
      // Handle comments if necessary (usually ignored in output)
      return '';
    } else if (isProcessingInstruction(node)) {
      // Handle processing instructions if necessary (usually ignored in output)
      return '';
    }

    return '';
  }).join('').replace(/\s+/g, ' ').trim();
}

// Helper function to format attributes
function formatAttributes(attribs: { [key: string]: string }): string {
  const attributes = Object.entries(attribs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return attributes ? ' ' + attributes : '';
}

// Type guards
function isElement(node: DomNode): node is Element {
  return node.type === ElementType.Tag;
}

function isText(node: DomNode): node is Text {
  return node.type === ElementType.Text;
}

function isComment(node: DomNode): node is Comment {
  return node.type === ElementType.Comment;
}

function isProcessingInstruction(node: DomNode): node is ProcessingInstruction {
  return node.type === ElementType.Directive;
}

export { normalizeHTML };
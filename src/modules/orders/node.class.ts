// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BinaryNode {
  constructor(
    private readonly data,
    private readonly left = null,
    private readonly right = null,
  ) {}
  insert(arr, i) {
    let root = null;
    if (i < arr.length) {
      root = new BinaryNode(arr[i]);
      root.left = this.insert(arr, 2 * i + 1);
      root.right = this.insert(arr, 2 * i + 2);
    }
    return root;
  }
  //this function create the binary tree in inOrder fation
  inOrder(root) {
    const nodes = [];
    if (root) {
      this.inOrder(root.left);
      nodes.push(root.data);
      this.inOrder(root.right);
    }
    return nodes;
  }

  includes(root, target) {
    if (root === null) return false;
    if (root.data.price === target.price && root.data.side !== target.side)
      return root.data;
    this.includes(root.left, target);
    this.includes(root.right, target);
  }
}

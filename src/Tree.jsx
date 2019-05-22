import Checkbox from '@trendmicro/react-checkbox';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import InfiniteTree from 'react-infinite-tree';
import TreeNode from './components/TreeNode';
import Toggler from './components/Toggler';
import Icon from './components/Icon';
import Clickable from './components/Clickable';
import Text from './components/Text';
import Label from './components/Label';
import Loading from './components/Loading';
// import { generate } from './tree-generator';

const renderTreeNode = ({ node, tree, toggleState, onUpdate }) => (
    <TreeNode
        selected={node.state.selected}
        depth={node.state.depth}
        onClick={(event) => {
            tree.selectNode(node);
        }}
    >
        <Toggler
            state={toggleState}
            onClick={(event) => {
                event.stopPropagation();

                if (toggleState === 'closed') {
                    tree.openNode(node);
                } else if (toggleState === 'opened') {
                    tree.closeNode(node);
                }
            }}
        />
        <Checkbox
            checked={node.state.checked}
            indeterminate={node.state.indeterminate}
            onClick={(event) => {
                event.stopPropagation();
            }}
            onChange={(event) => {
                tree.checkNode(node);
                onUpdate(node);
            }}
        />
        <Clickable>
            <Icon state={toggleState} />
            <Text>{node.name}</Text>
        </Clickable>
        {(node.loadOnDemand && node.children.length === 0 && !node.state.loading) &&
            <i className="fa fa-fw fa-ellipsis-v" />
        }
        {node.state.loading && <Loading />}
        {/* <Label style={{ position: 'absolute', right: 5, top: 6 }}>
            {node.children.length}
        </Label> */}
        <Dropdown
            // style={{ position: 'absolute', right: 20, top: 4 }}
            // pullRight
        >
            <Dropdown.Toggle
                noCaret
                btnSize="xs"
                btnStyle="link"
                style={{ padding: 0 }}
            >
                <i className="dropdown fa fa-fw fa-cog" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <MenuItem>{node.name}</MenuItem>
            </Dropdown.Menu>
        </Dropdown>
    </TreeNode>
);

class Tree extends PureComponent {

    static propTypes = {
        onUpdate: PropTypes.func
    };

    data = [{id: 'root', name: 'Investigations', loadOnDemand: true}]
    tree = null

    componentDidMount() {
        this.tree.selectNode(this.tree.getChildNodes()[0]);
        this.tree.openNode(this.tree.getChildNodes()[0]);
    }

    render() {
        const { onUpdate } = this.props;
        return (
            <InfiniteTree
                ref={node => {
                    this.tree = node ? node.tree : null;
                }}
                style={{
                    border: '1px solid #ccc'
                }}
                autoOpen
                selectable
                tabIndex={0}
                data={this.data}
                width="100%"
                height={500}
                rowHeight={25}
                shouldLoadNodes={(node) => {
                    return !node.hasChildren() && node.loadOnDemand;
                }}
                loadNodes={(parentNode, done) => {
                    var id = parentNode.id
                    if (isNaN(id))
                        id = id.replace(/ /g, '+')
                    fetch('http://localhost:5000/api/nav_table?id=' + id, {
                        method: 'GET'
                    }).then(function(response) {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        }
                        return response.json();
                    }).then(function(table) {
                        done(null, table);
                     }).catch(err => {
                        console.log('Data Error:',err);
                    })
                }}
                shouldSelectNode={(node) => { // Defaults to null
                    if (!node || (node === this.tree.getSelectedNode())) {
                        return false; // Prevent from deselecting the current node
                    }
                    return true;
                }}
                onKeyUp={(event) => {
                    console.log('onKeyUp', event.target);
                }}
                onKeyDown={(event) => {
                    console.log('onKeyDown', event.target);

                    event.preventDefault();

                    const node = this.tree.getSelectedNode();
                    const nodeIndex = this.tree.getSelectedIndex();

                    if (event.keyCode === 37) { // Left
                        this.tree.closeNode(node);
                    } else if (event.keyCode === 38) { // Up
                        const prevNode = this.tree.nodes[nodeIndex - 1] || node;
                        this.tree.selectNode(prevNode);
                    } else if (event.keyCode === 39) { // Right
                        this.tree.openNode(node);
                    } else if (event.keyCode === 40) { // Down
                        const nextNode = this.tree.nodes[nodeIndex + 1] || node;
                        this.tree.selectNode(nextNode);
                    }
                }}
                onScroll={(scrollOffset, event) => {
                    const child = event.target.firstChild;
                    const treeViewportHeight = 400;
                    console.log((scrollOffset / (child.scrollHeight - treeViewportHeight) * 100).toFixed(2));
                    console.log('onScroll', scrollOffset, event);
                }}
                onContentWillUpdate={() => {
                    console.log('onContentWillUpdate');
                }}
                onContentDidUpdate={() => {
                    console.log('onContentDidUpdate');
                    onUpdate(this.tree.getSelectedNode());
                }}
                onOpenNode={(node) => {
                    console.log('onOpenNode:', node);
                }}
                onCloseNode={(node) => {
                    console.log('onCloseNode:', node);
                }}
                onSelectNode={(node) => {
                    console.log('onSelectNode:', node);
                    onUpdate(node);
                }}
                onWillOpenNode={(node) => {
                    console.log('onWillOpenNode:', node);
                }}
                onWillCloseNode={(node) => {
                    console.log('onWillCloseNode:', node);
                }}
                onWillSelectNode={(node) => {
                    console.log('onWillSelectNode:', node);
                }}
            >
                {({ node, tree }) => {
                    const hasChildren = node.hasChildren();

                    let toggleState = '';
                    if ((!hasChildren && node.loadOnDemand) || (hasChildren && !node.state.open)) {
                        toggleState = 'closed';
                    }
                    if (hasChildren && node.state.open) {
                        toggleState = 'opened';
                    }

                    return renderTreeNode({ node, tree, toggleState, onUpdate });
                }}
            </InfiniteTree>
        );
    }
}

export default Tree;

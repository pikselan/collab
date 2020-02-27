import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';

import firebase from '../../firebase';

class Channels extends React.Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelRefs: firebase.database().ref('channels'),
        firstLoad: true,
        activeChannel: ''
    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelRefs.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
        })
    }

    removeListeners = () => {
        this.state.channelRefs.off();
    }

    setFirstChannel = () => {
        const firtsChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length >0) {
            this.props.setCurrentChannel(firtsChannel);
            this.setActiveChannel(firtsChannel);
        }
        this.setState({ firstLoad: false });
    }

    addChannel = () => {
        const { channelRefs, channelName, channelDetails, user } = this.state;
        const key = channelRefs.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelRefs
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetails: ''});
                this.closeModal();
                console.log('channel added');
            })
            .catch(err => {
                console.error(err);
            })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    changeChannels = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item 
                key={channel.id}
                onClick={() => this.changeChannels(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel} >
                    # {channel.name}
            </Menu.Item>
        ))
    )

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    render() {
        const { channels, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{" "}
                        ({ channels.length }) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                {/* {Add Channel Modal} */}
                <Modal basic open={modal} onClose={this.closeModal} >
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange} />
                            </Form.Field>

                            <Form.Field>
                                <Input 
                                    fluid
                                    label="About of Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(null, { setCurrentChannel })(Channels);
import { Actions, AppEnv, Data, Mutable, State, StateActions } from '../types';
import { getWalletStatusFromState, Logger } from '../utils';

export class StateBase {
  protected _mutable: Mutable<Data>;
  actions?: StateActions<Data>;
  protected _env?: AppEnv;
  logger?: Logger;

  constructor() {
    this._mutable = { state: State.Init };
  }

  get env() {
    return this._env;
  }

  setEnv(env?: AppEnv) {
    this._env = env;
  }

  setActions = (actions: Actions) => {
    this.actions = actions;
  };

  get isMobile() {
    return this.env?.device === 'mobile';
  }

  get mutable() {
    return this._mutable;
  }

  get state() {
    return this.mutable.state;
  }

  get isInit() {
    return this.state === 'Init';
  }

  get isDone() {
    return this.state === 'Done';
  }

  get isError() {
    return this.state === 'Error';
  }

  get isPending() {
    return this.state === 'Pending';
  }

  get data() {
    return this.mutable.data;
  }

  get message() {
    return this.mutable.message;
  }

  setState(state: State) {
    this._mutable.state = state;
    this.actions?.state?.(state);
  }

  setData(data: Data | undefined) {
    this._mutable.data = data;
    this.actions?.data?.(data);
  }

  setMessage(message: string | undefined) {
    this._mutable.message = message;
    this.actions?.message?.(message);
  }

  reset() {
    this.setData(undefined);
    this.setMessage(undefined);
    this.setState(State.Init);
  }

  get walletStatus() {
    return getWalletStatusFromState(this.state, this.message);
  }

  get isWalletOnceConnect() {
    return (
      this.isWalletConnected || this.isWalletNotExist || this.isWalletError
    );
  }

  get isWalletConnecting() {
    return this.walletStatus === 'Connecting';
  }

  get isWalletConnected() {
    return this.walletStatus === 'Connected';
  }

  get isWalletDisconnected() {
    return this.walletStatus === 'Disconnected';
  }

  get isWalletRejected() {
    return this.walletStatus === 'Rejected';
  }

  get isWalletNotExist() {
    return this.walletStatus === 'NotExist';
  }

  get isWalletError() {
    return this.walletStatus === 'Error';
  }
}

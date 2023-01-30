/**
 * This file was automatically generated. Do not modify it, if you encounter any problems 
- please raise an issue: https://github.com/warp-contracts/warp-wasm-templates/issues.
 */

import {
  WriteInteractionOptions,
  WriteInteractionResponse,
  Contract,
  Warp,
  ArWallet,
  ContractError,
  EvaluationOptions
} from 'warp-contracts';
import {
  ArchivesByURL,
  ArchivesByURLResult,
  ArchiveRequestsFor,
  ArchiveRequestsForResult,
  ArchiveRequestByID,
  ArchiveRequestByIDResult
} from './View';
import {
  RegisterUploader,
  RequestArchiving,
  SubmitArchive,
  DeleteArchiveRequest,
  DeRegisterUploader,
  Evolve
} from './WriteAction';
import { State } from './ContractState';

export interface BaseInput {
  function: string;
}

export class AwtContract {
  readonly contract: Contract<State>;

  constructor(contractId: string, warp: Warp) {
    this.contract = warp.contract<State>(contractId);
  }

  connect(wallet: ArWallet) {
    this.contract.connect(wallet);
    return this;
  }

  setEvaluationOptions(evaluationOptions: Partial<EvaluationOptions>) {
    this.contract.setEvaluationOptions(evaluationOptions);
    return this;
  }

  async currentState(): Promise<State> {
    const { cachedValue } = await this.contract.readState();
    return cachedValue.state;
  }

  async archivesByURL(archivesByURL: ArchivesByURL): Promise<ArchivesByURLResult> {
    const interactionResult = await this.contract.viewState<BaseInput & ArchivesByURL, ArchivesByURLResult>({
      function: 'archivesByURL',
      ...archivesByURL
    });
    if (interactionResult.type == 'error') {
      throw new ContractError(interactionResult.errorMessage);
    } else if (interactionResult.type == 'exception') {
      throw Error(interactionResult.errorMessage);
    }
    return interactionResult.result;
  }

  async archiveRequestsFor(archiveRequestsFor: ArchiveRequestsFor): Promise<ArchiveRequestsForResult> {
    const interactionResult = await this.contract.viewState<BaseInput & ArchiveRequestsFor, ArchiveRequestsForResult>({
      function: 'archiveRequestsFor',
      ...archiveRequestsFor
    });
    if (interactionResult.type == 'error') {
      throw new ContractError(interactionResult.errorMessage);
    } else if (interactionResult.type == 'exception') {
      throw Error(interactionResult.errorMessage);
    }
    return interactionResult.result;
  }

  async archiveRequestByID(archiveRequestByID: ArchiveRequestByID): Promise<ArchiveRequestByIDResult> {
    const interactionResult = await this.contract.viewState<BaseInput & ArchiveRequestByID, ArchiveRequestByIDResult>({
      function: 'archiveRequestByID',
      ...archiveRequestByID
    });
    if (interactionResult.type == 'error') {
      throw new ContractError(interactionResult.errorMessage);
    } else if (interactionResult.type == 'exception') {
      throw Error(interactionResult.errorMessage);
    }
    return interactionResult.result;
  }

  async registerUploader(
    registerUploader: RegisterUploader,
    options?: WriteInteractionOptions
  ): Promise<WriteInteractionResponse | null> {
    return await this.contract.writeInteraction<BaseInput & RegisterUploader>(
      { function: 'registerUploader', ...registerUploader },
      options
    );
  }

  async requestArchiving(
    requestArchiving: RequestArchiving,
    options?: WriteInteractionOptions
  ): Promise<WriteInteractionResponse | null> {
    return await this.contract.writeInteraction<BaseInput & RequestArchiving>(
      { function: 'requestArchiving', ...requestArchiving },
      options
    );
  }

  async submitArchive(
    submitArchive: SubmitArchive,
    options?: WriteInteractionOptions
  ): Promise<WriteInteractionResponse | null> {
    return await this.contract.writeInteraction<BaseInput & SubmitArchive>(
      { function: 'submitArchive', ...submitArchive },
      options
    );
  }

  async deleteArchiveRequest(
    deleteArchiveRequest: DeleteArchiveRequest,
    options?: WriteInteractionOptions
  ): Promise<WriteInteractionResponse | null> {
    return await this.contract.writeInteraction<BaseInput & DeleteArchiveRequest>(
      { function: 'deleteArchiveRequest', ...deleteArchiveRequest },
      options
    );
  }

  async deRegisterUploader(
    deRegisterUploader: DeRegisterUploader,
    options?: WriteInteractionOptions
  ): Promise<WriteInteractionResponse | null> {
    return await this.contract.writeInteraction<BaseInput & DeRegisterUploader>(
      { function: 'deRegisterUploader', ...deRegisterUploader },
      options
    );
  }

  async evolve(evolve: Evolve, options?: WriteInteractionOptions): Promise<WriteInteractionResponse | null> {
    return await this.contract.writeInteraction<BaseInput & Evolve>({ function: 'evolve', ...evolve }, options);
  }
}

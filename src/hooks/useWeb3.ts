import React, { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import sample from 'lodash/sample';
import { getWeb3NoAccount } from './web3Utils';
import config from '../config/constants';

const useWeb3 = () => {
  const { library } = useWeb3React();
  const refEth = useRef(library);
  const _chainId = window?.provider?.chainId;
  const chainId = parseInt(_chainId);
  const rpcUrl = (config as any)[chainId]?.RPC_URL;
  const [web3, setWeb3] = useState(library ? new Web3(library) : getWeb3NoAccount(sample(rpcUrl)));

  useEffect(() => {
    if (library !== refEth.current) {
      setWeb3(library ? new Web3(library) : getWeb3NoAccount(sample(rpcUrl)));
      refEth.current = library;
    }
  }, [library]);
  return web3;
};

export default useWeb3;

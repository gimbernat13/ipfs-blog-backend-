import { ethers } from "ethers";
interface VerifyMessageParams {
    message: string;
    address: string;
    signature: string;
}


export const verifyMessage = async ({ message, address, signature }: VerifyMessageParams) => {
    try {
        let signerAddr = ethers.utils.verifyMessage(message, signature);
        console.log("-------Verify Message Function-------")
        console.log("🚧 Signers Address:", signerAddr)
        console.log("🚧 Request Address:", address)
        if (signerAddr !== address) {
            return false;
        }
        console.log("✅ Eths Signature verified:", address)
        return true;

    } catch (err) {
        console.log("🚨", err);
        return false;
    }
}

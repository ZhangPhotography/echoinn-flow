export const MINT_COL_NFT=`

import NonFungibleToken from "0x8df565bfae3cce15"
import ExampleNFT from "0x8df565bfae3cce15"
import MetadataViews from "0x8df565bfae3cce15"
import FungibleToken from "0x8df565bfae3cce15"
transaction(
  brief: String,
  kolAddress: String ,
  ownerAddress: String,

) {
  let recipientRef: &{NonFungibleToken.CollectionPublic}
  let minterRef: &ExampleNFT.NFTMinter
  

    prepare(signer: AuthAccount) {
       
        if signer.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath) == nil {
            // Create a new empty collection
           let collection <- ExampleNFT.createEmptyCollection()

           // save it to the account
           signer.save(<-collection, to: ExampleNFT.CollectionStoragePath)

          // create a public capability for the collection
          signer.link<&{NonFungibleToken.CollectionPublic, ExampleNFT.ExampleNFTCollectionPublic, MetadataViews.ResolverCollection}>(
              ExampleNFT.CollectionPublicPath,
              target: ExampleNFT.CollectionStoragePath
          )
        }

         // Create a new empty collection
        let minter <- ExampleNFT.createNFTMinter()

        // save it to the account
        signer.save(<-minter, to: ExampleNFT.MinterStoragePath)
       
            // display a NFT
       self.recipientRef = signer.getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
            .borrow()
            ?? panic("Could not get receiver reference to the NFT Collection")
      //take a NFT
      self.minterRef = signer.borrow<&ExampleNFT.NFTMinter>(from: ExampleNFT.MinterStoragePath)
          ?? panic("could not borrow minter reference")
    }

    execute {
        var royalties: [MetadataViews.Royalty] = []
        //var recipient: [address]=

        // Mint the NFT 
        self.minterRef.mintNFT(
            recipient: self.recipientRef,
            name: brief,
            description: kolAddress,
            thumbnail: ownerAddress,
            royalties: royalties
        )
        log("hello")

        
    }

}

`
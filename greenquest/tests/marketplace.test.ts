import { describe, it, expect, beforeEach } from "vitest"

// Mock the NFT Marketplace Contract
const mockContract = {
  admin: "ST1ADMIN11111111111111111111111111111111",
  listings: new Map<number, { seller: string; price: number }>(),
  nftOwnership: new Map<number, string>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  listNft(caller: string, nftId: number, price: number) {
    const owner = this.nftOwnership.get(nftId)
    if (owner !== caller) {
      return { error: 103 } // ERR-NOT-OWNER
    }
    if (this.listings.has(nftId)) {
      return { error: 102 } // ERR-ALREADY-LISTED
    }
    this.listings.set(nftId, { seller: caller, price })
    return { value: true }
  },

  buyNft(caller: string, nftId: number, amount: number) {
    const listing = this.listings.get(nftId)
    if (!listing) return { error: 101 } // ERR-NOT-FOUND

    if (amount < listing.price) {
      return { error: 104 } // ERR-INSUFFICIENT_PAYMENT
    }

    // Simulate transfer of STX and NFT
    this.nftOwnership.set(nftId, caller)
    this.listings.delete(nftId)
    return { value: true }
  },

  cancelListing(caller: string, nftId: number) {
    const listing = this.listings.get(nftId)
    if (!listing) return { error: 101 } // ERR-NOT-FOUND

    if (listing.seller !== caller) {
      return { error: 100 } // ERR-NOT-AUTHORIZED
    }

    this.listings.delete(nftId)
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (caller !== this.admin) {
      return { error: 100 } // ERR-NOT-AUTHORIZED
    }
    this.admin = newAdmin
    return { value: true }
  },

  getListing(nftId: number) {
    return this.listings.get(nftId) || null
  },
}

describe("GreenQuest NFT Marketplace", () => {
  const admin = "ST1ADMIN11111111111111111111111111111111"
  const user1 = "ST2USER111111111111111111111111111111111"
  const user2 = "ST3BUYER11111111111111111111111111111111"

  beforeEach(() => {
    mockContract.admin = admin
    mockContract.listings = new Map()
    mockContract.nftOwnership = new Map([[1, user1]])
  })

  it("allows the owner to list their NFT", () => {
    const result = mockContract.listNft(user1, 1, 500)
    expect(result).toEqual({ value: true })
    expect(mockContract.getListing(1)).toEqual({ seller: user1, price: 500 })
  })

  it("prevents listing if not the owner", () => {
    const result = mockContract.listNft(user2, 1, 500)
    expect(result).toEqual({ error: 103 }) // ERR-NOT-OWNER
  })

  it("prevents duplicate listings", () => {
    mockContract.listNft(user1, 1, 500)
    const result = mockContract.listNft(user1, 1, 600)
    expect(result).toEqual({ error: 102 }) // ERR-ALREADY-LISTED
  })

  it("allows purchase with sufficient STX", () => {
    mockContract.listNft(user1, 1, 500)
    const result = mockContract.buyNft(user2, 1, 600)
    expect(result).toEqual({ value: true })
    expect(mockContract.nftOwnership.get(1)).toBe(user2)
    expect(mockContract.getListing(1)).toBe(null)
  })

  it("fails purchase with insufficient STX", () => {
    mockContract.listNft(user1, 1, 500)
    const result = mockContract.buyNft(user2, 1, 400)
    expect(result).toEqual({ error: 104 }) // ERR-INSUFFICIENT_PAYMENT
  })

  it("allows seller to cancel listing", () => {
    mockContract.listNft(user1, 1, 500)
    const result = mockContract.cancelListing(user1, 1)
    expect(result).toEqual({ value: true })
    expect(mockContract.getListing(1)).toBe(null)
  })

  it("prevents non-seller from cancelling", () => {
    mockContract.listNft(user1, 1, 500)
    const result = mockContract.cancelListing(user2, 1)
    expect(result).toEqual({ error: 100 }) // ERR-NOT-AUTHORIZED
  })

  it("allows admin to transfer admin rights", () => {
    const result = mockContract.transferAdmin(admin, user2)
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe(user2)
  })

  it("prevents non-admin from transferring admin rights", () => {
    const result = mockContract.transferAdmin(user1, user2)
    expect(result).toEqual({ error: 100 }) // ERR-NOT-AUTHORIZED
  })
})

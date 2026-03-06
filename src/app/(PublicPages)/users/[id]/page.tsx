"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import ProductCard from "@/components/ProductComponents/ProductCard";
import FollowButton from "@/components/small/FollowButton";
import { Product } from "@/types/Product";

interface UserProfile {
  _id: string
  name: string
  username: string
  image?: string
  bio?: string
  website?: string
  followersCount: number
  followingCount: number
  isFollowing: boolean
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = use(params)

  const router = useRouter()
  const { data: session } = useSession()

  const [user,setUser] = useState<UserProfile | null>(null)
  const [products,setProducts] = useState<Product[]>([])

  //////////////////////////////////////////////////////
  // LOAD PROFILE
  //////////////////////////////////////////////////////

  async function loadProfile(){

    const res = await fetch(`/api/users/${id}`)
    const data = await res.json()

    setUser(data.user)
    setProducts(data.products)

  }

  useEffect(()=>{
    loadProfile()
  },[id])

  //////////////////////////////////////////////////////
  // FOLLOW HANDLERS
  //////////////////////////////////////////////////////

  function handleFollowClick(){

    const callback = window.location.pathname

    router.push(
      `/login?mode=login&callbackUrl=${encodeURIComponent(callback)}`
    )

  }

  function handleFollowChange(isFollowing:boolean){

    setUser(prev => {

      if(!prev) return prev

      return {
        ...prev,
        followersCount: isFollowing
          ? prev.followersCount + 1
          : Math.max(prev.followersCount - 1,0),
        isFollowing
      }

    })

  }

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if(!user){

    return(
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Loading profile...
      </div>
    )

  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return(

    <div className="min-h-screen bg-neutral-950 text-white">

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">

        {/* PROFILE HEADER */}

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 mb-16">

          <div className="flex flex-col md:flex-row gap-10 md:items-start">

            <div className="w-28 h-28 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center text-4xl font-semibold">

              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.[0]?.toUpperCase()
              )}

            </div>

            <div className="flex-1">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>

                  <h1 className="text-3xl md:text-4xl font-bold">
                    {user.name}
                  </h1>

                  <p className="text-neutral-400 mt-1">
                    @{user.username}
                  </p>

                </div>

                {session?.user?.id !== user._id && (

                  session ? (

                    <FollowButton
                      targetUserId={user._id}
                      profileName={user.username}
                      initialIsFollowing={user.isFollowing}
                      onFollowChange={handleFollowChange}
                    />

                  ) : (

                    <button
                      onClick={handleFollowClick}
                      className="px-6 py-2 rounded-lg bg-amber-500 text-black hover:bg-amber-400"
                    >
                      Follow
                    </button>

                  )

                )}

              </div>

              {user.bio && (
                <p className="mt-6 text-neutral-300 max-w-3xl">
                  {user.bio}
                </p>
              )}

              <div className="flex gap-10 mt-8 text-sm">

                <div>
                  <span className="text-xl font-semibold">
                    {user.followersCount}
                  </span>
                  <p className="text-neutral-500 text-xs mt-1">
                    Followers
                  </p>
                </div>

                <div>
                  <span className="text-xl font-semibold">
                    {user.followingCount}
                  </span>
                  <p className="text-neutral-500 text-xs mt-1">
                    Following
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* PRODUCTS */}

        <div className="flex items-center justify-between mb-12">

          <h2 className="text-2xl font-semibold">
            Published Components
          </h2>

          <span className="text-sm text-neutral-500">
            {products.length} items
          </span>

        </div>

        {products.length === 0 && (

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-14 text-center text-neutral-500">
            No published products yet.
          </div>

        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {products.map(p => (
            <ProductCard key={p._id} product={p}/>
          ))}

        </div>

      </div>

    </div>

  )

}
import { db, createPrismaClient } from "@/lib/db"

export type CreatorVideoItem = {
  id: string
  title: string | null
  thumbnailUrl: string
  videoUrl: string | null
  productId: string | null
  product?: {
    id: string
    name: string
    slug: string
    mainImage: string
  } | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const defaultVideos = [
  { title: "Earbuds Unboxing & Review", thumbnailUrl: "/creator-earbuds.png", sortOrder: 0 },
  { title: "Night Drive Dashcam Test", thumbnailUrl: "/creator-dashcam.png", sortOrder: 1 },
  { title: "Smartwatch Daily Life Test", thumbnailUrl: "/creator-smartwatch.png", sortOrder: 2 },
  { title: "Cozy Cinema Projector Night", thumbnailUrl: "/creator-projector.png", sortOrder: 3 },
]

function getCreatorVideoModel() {
  try {
    const model = (db as any).creatorVideo
    if (model && typeof model.count === "function") {
      return model
    }
  } catch {}

  const fresh = createPrismaClient() as any
  if (fresh && fresh.creatorVideo && typeof fresh.creatorVideo.count === "function") {
    return fresh.creatorVideo
  }

  throw new Error("Prisma CreatorVideo model delegate is unavailable")
}

export async function ensureDefaultCreatorVideosSeeded() {
  try {
    const model = getCreatorVideoModel()
    if (!model) return
    const count = await model.count()
    if (count === 0) {
      for (let index = 0; index < defaultVideos.length; index++) {
        const item = defaultVideos[index]
        await model.create({
          data: {
            title: item.title,
            thumbnailUrl: item.thumbnailUrl,
            sortOrder: item.sortOrder,
            isActive: true,
          },
        })
      }
    }
  } catch (error) {
    console.error("Default creator videos seeding failed:", error)
  }
}

export async function listCreatorVideos(): Promise<CreatorVideoItem[]> {
  await ensureDefaultCreatorVideosSeeded()
  const model = getCreatorVideoModel()
  return model.findMany({
    include: {
      product: {
        select: { id: true, name: true, slug: true, mainImage: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  })
}

export async function listActiveCreatorVideos(): Promise<CreatorVideoItem[]> {
  await ensureDefaultCreatorVideosSeeded()
  const model = getCreatorVideoModel()
  return model.findMany({
    where: { isActive: true },
    include: {
      product: {
        select: { id: true, name: true, slug: true, mainImage: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  })
}

export async function createCreatorVideo(data: {
  title?: string
  thumbnailUrl: string
  videoUrl?: string
  productId?: string
  sortOrder?: number
  isActive?: boolean
}) {
  const model = getCreatorVideoModel()
  return model.create({
    data: {
      title: data.title || null,
      thumbnailUrl: data.thumbnailUrl,
      videoUrl: data.videoUrl || null,
      productId: data.productId || null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
    include: {
      product: {
        select: { id: true, name: true, slug: true, mainImage: true },
      },
    },
  })
}

export async function updateCreatorVideo(
  id: string,
  data: Partial<{
    title: string
    thumbnailUrl: string
    videoUrl: string
    productId: string | null
    sortOrder: number
    isActive: boolean
  }>
) {
  const model = getCreatorVideoModel()
  return model.update({
    where: { id },
    data,
    include: {
      product: {
        select: { id: true, name: true, slug: true, mainImage: true },
      },
    },
  })
}

export async function deleteCreatorVideo(id: string) {
  const model = getCreatorVideoModel()
  return model.delete({
    where: { id },
  })
}

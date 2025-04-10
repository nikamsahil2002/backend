

const findAll = async (collection, searchQuery, sortOrder, skip, limit, projectFields, lookupFields) => {

    const result = await collection.aggregate([
        ...lookupFields,
        { $match: { deletedAt: null, ...searchQuery } },
        {
          $facet: {
            totalResponses: [{ $count: "count" }],
            result: [
              { $sort: { updatedAt : sortOrder }},
              { $skip: skip },
              { $limit: limit },
              {
                $project: projectFields
              }
            ]
          }
        },
        {
          $project: {
            totalResponses: { $arrayElemAt: ["$totalResponses.count", 0] },
            result: 1
          }
        }
    ]);
    return result;
}

module.exports = {
    findAll
}


const findAll = async (collection, searchQuery, sortObject, skip, limit, projectFields, lookupFields) => {
    const result = await collection.aggregate([
        ...lookupFields,
        { $match: { deletedAt: null, ...searchQuery } },
        {
          $facet: {
            totalResponses: [{ $count: "count" }],
            result: [
              { $sort: sortObject},
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

const checkIfRecordExist = async(collection, id) => {
  const result = await collection.findById(id);
  return result ? true : false;
}

module.exports = {
    findAll,
    checkIfRecordExist
}
import { collection, doc, getDocs, setDoc } from "@firebase/firestore";
import {
  auth,
  db,
  getFirebaseItems,
  getFirebaseItemWithCondition,
} from "./firebase";
import { getTalentInfoByClass } from "./home";

export const createClass = async ({
  title,
  summary,
  numLessons,
  dateBegin,
  dateEnd,
  teacher,
  talents,
  user,
}) => {
  await setDoc(doc(collection(db, "Classes")), {
    className: title,
    numLessons: numLessons,
    dateBegin: dateBegin,
    dateEnd: dateEnd,
    numTalents: talents.length,
    summary: summary,
    teacherID: teacher,
  })
    .then(async (data) => {
      const createdClass = await getFirebaseItemWithCondition("Classes", [
        "className",
        "==",
        title,
      ]);
      await setDoc(
        doc(collection(db, `Classes/${createdClass.id}/ClassTalents`)),
        {
          talentIDs: talents,
        }
      );

      await auth.updateCurrentUser(user);
      window.location.href = "/";
    })
    .catch((err) => {
      throw err;
    });
};

export const getClasses = async ({ queryKey }) => {
  // console.log("querykey", queryKey);
  const [_key, { currentUser:userInfo }] = queryKey
  let classes = [];
  switch (parseInt(userInfo.role)) {
    case 0: //admin
    case 1: //teacher
      classes = await getFirebaseItems("Classes");
      break;

    case 2: // talent
      //students
      console.log("nani");
      const classList = await getFirebaseItems("Classes");
      for (let i = 0; i < classList.length; i++) {
        let tmp = await getFirebaseItems(
          "Classes",
          classList[i].id,
          "ClassTalents"
        );
        tmp = tmp[0]?.talentIDs;
        const index = tmp.findIndex((item) => item === userInfo.userID);
        if (index > -1) {
          // Get total attendance and total achivement
          const { totalAttendance, totalAchivement } =
            await getTalentInfoByClass(classList[i].id, userInfo.email);
          classList[i].totalAttendance = totalAttendance;
          classList[i].totalAchivement = Math.round(totalAchivement);
          classes.push(classList[i]);
        }
      }
      break;
    default:
      break;
  }

  // Get classes 's teacher 's name
  const usersRef = (await getDocs(collection(db, "Users"))).docs;
  const users = usersRef.map((user) => user.data());
  const result = classes.map((kurasu) => {
    let teacherName = "";
    users.every((user) => {
      if (user.userID === kurasu.teacherID) {
        teacherName = user.name;
        return false;
      }
      return true;
    });

    return { ...kurasu, teacherName };
  });

  return result;
};

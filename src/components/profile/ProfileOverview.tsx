import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, formatTime } from "@/lib/mockData";
import { motion } from "framer-motion";

interface ProfileOverviewProps {
  user: User;
}

const ProfileOverview = ({ user }: ProfileOverviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Member since {new Date(user.joinDate).toLocaleDateString()}
          </p>
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { label: "Total Coding Time", value: formatTime(user.totalCodingTime) },
            { label: "Daily Average", value: formatTime(user.dailyAverage) },
            { label: "Top Language", value: user.languages[0].name }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
